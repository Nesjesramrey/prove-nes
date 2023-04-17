import { Component, HostBinding, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ShareSheetComponent } from '../components/share-sheet/share-sheet.component';
import { UserService } from '../services/user.service';
import { VoteDialogComponent } from '../components/vote-dialog/vote-dialog.component';
import { UtilityService } from '../services/utility.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SinglePostDialogComponent } from './components/single-post-dialog/single-post-dialog.component';
import { PostsService } from '../services/posts.service';
import { VoteService } from '../services/vote.service';
import { FavoritesService } from '../services/favorites.service';
import { forkJoin, Observable } from 'rxjs';
import { UseToolsDialogComponent } from './components/use-tools-dialog/use-tools-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: '.posts-page',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  public isMobile: boolean = false;
  public isDataAvailable: boolean = false;
  public user: any = null;
  @HostBinding('class') public class: string = '';
  public posts: any = null;
  public postsPage: number = 1;
  public submitted: boolean = false;
  public searchTeamsFG!: FormGroup;
  public states: any = null;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public userService: UserService,
    public utilityService: UtilityService,
    public matBottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public postsService: PostsService,
    public voteService: VoteService,
    public favoritesService: FavoritesService,
    public formBuilder: FormBuilder
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();
    let posts: Observable<any> = this.postsService.fetchAllPosts({ limit: 10, page: this.postsPage });
    let states: Observable<any> = this.utilityService.fetchAllStates();
    forkJoin([user, posts, states]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.user = reply[0];
        // console.log(this.user['status']);

        this.posts = reply[1][0]['data'];
        this.setPostsCards();

        if (this.user['status'] == undefined) {
          this.updatePostsFavorites();
          this.updatePostsVotes();
        }

        this.states = reply[2];
        // console.log('states: ', this.states);
      },
      complete: () => {
        this.searchTeamsFG = this.formBuilder.group({
          filter: ['', [Validators.required]],
          coverage: ['', []]
        });
        this.isDataAvailable = true;
        // if (this.user['status'] != undefined) {
        //   setTimeout(() => {
        //     this.popUseToolsDialog();
        //   }, 1000);
        // }
        this.posts.filter((x: any) => {
          if (x['card']['images'] != null) {
            if (x['card']['images'][0] != undefined) {
              var fileExt = x['card']['images'][0].split('.').pop();
              if (fileExt == 'mp4' || fileExt == '3gpp' || fileExt == 'mov') {
                x['card']['hasVideo'] = true;
              }
            }
          }
        });
        // console.log(this.posts);
      }
    });
  }

  sharePost(post: any) {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user,
        post: post
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  openVoteDialog(post: any) {
    if (post['voted']) {
      this.utilityService.openSuccessSnackBar('Ya votaste');
      return;
    }
    const dialogRef = this.dialog.open<any>(VoteDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { post: post }
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        post['card']['vote'].push(reply['data']);
        this.updatePostsVotes();
      }
    });
  }

  openSinglePostDialog(post: any) {
    if (this.user == null) {
      if (this.isMobile) {
        this.utilityService.linkMe('/hub/signin-mobile');
      } else {
        this.utilityService.linkMe('/hub/ingresar');
      }
      return;
    }

    let panelClass: string = '';

    switch (this.isMobile) {
      case true:
        panelClass = 'full-dialog';
        break;
      case false:
        panelClass = 'posts-dialog';
        break;
    }

    const dialogRef = this.dialog.open<any>(SinglePostDialogComponent, {
      data: {
        post: post,
        user: this.user,
        obj: 'single-post'
      },
      backdropClass: 'card-backdrop',
      panelClass: panelClass
    });
    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { post = reply; }
    });
  }

  handleComplaintFavorite(post: any) {
    if (this.user == null) {
      if (this.isMobile) {
        this.utilityService.linkMe('/hub/signin-mobile');
      } else {
        this.utilityService.linkMe('/hub/ingresar');
      }
      return;
    }

    let data: any = {};

    switch (post['isFavorite']) {
      case true:
        let favorite: any = post['card']['favorites'].filter((x: any) => { return x['createdBy'] == this.user['_id']; });
        data = { layout: favorite[0]['_id'] }
        this.favoritesService.deleteFavorites(data).subscribe({
          error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
          next: (reply: any) => { delete post['isFavorite']; },
          complete: () => { }
        });
        break;

      case undefined:
        data = { complaint: post['card']['_id'] }
        this.favoritesService.addFavorites(data).subscribe({
          error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
          next: (reply: any) => {
            post['card']['favorites'].push(reply['data']);
            this.updatePostsFavorites();
          },
          complete: () => { }
        });
        break;
    }
  }

  handleTestimonyFavorite(post: any) {
    if (this.user == null) {
      if (this.isMobile) {
        this.utilityService.linkMe('/hub/signin-mobile');
      } else {
        this.utilityService.linkMe('/hub/ingresar');
      }
      return;
    }

    let data: any = {};

    switch (post['isFavorite']) {
      case true:
        let favorite: any = post['card']['favorites'].filter((x: any) => { return x['createdBy'] == this.user['_id']; });
        data = { layout: favorite[0]['_id'] }
        this.favoritesService.deleteFavorites(data).subscribe({
          error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
          next: (reply: any) => { delete post['isFavorite']; },
          complete: () => { }
        });
        break;

      case undefined:
        data = { testimony: post['card']['_id'] }
        this.favoritesService.addFavorites(data).subscribe({
          error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
          next: (reply: any) => {
            post['card']['favorites'].push(reply['data']);
            this.updatePostsFavorites();
          },
          complete: () => { }
        });
        break;
    }
  }

  updatePostsFavorites() {
    this.posts.filter((x: any) => {
      x['card']['favorites'].filter((f: any) => {
        if (f['createdBy'] == this.user['_id']) { x['isFavorite'] = true; }
      });
    });
  }

  updatePostsVotes() {
    this.posts.filter((x: any) => {
      x['card']['vote'].filter((f: any) => {
        if (f['createdBy'] == this.user['_id']) { x['voted'] = true; }
      });
    });
  }

  setPostsCards() {
    this.posts.filter((x: any) => {
      switch (x['relation']) {
        case 'complaint':
          x['card'] = x['complaint'][0];
          break;
        case 'testimony':
          x['card'] = x['testimony'][0];
          break;
      }
    });
  }

  loadMorePosts() {
    this.submitted = true;
    this.postsPage = this.postsPage + 1;
    this.postsService.fetchAllPosts({ limit: 10, page: this.postsPage }).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.submitted = false;
      },
      next: (reply: any) => {
        reply[0]['data'].filter((x: any) => { this.posts.push(x); });
        this.setPostsCards();
      },
      complete: () => { this.submitted = false; }
    });
  }

  popUseToolsDialog() {
    const dialogRef = this.dialog.open<any>(UseToolsDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  filterPosts(form: FormGroup) {
    let data: any = {
      filter: form['value']['filter'],
      coverage: form['value']['coverage'],
    };

    this.postsService.filterPosts(data).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        if (reply.length == 0) {
          this.utilityService.openErrorSnackBar('No hay resultados para tu busqueda.');
          return;
        }
        this.posts = reply;
        this.setPostsCards();
      },
      complete: () => { }
    });
  }
}
