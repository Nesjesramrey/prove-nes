import { Component, HostBinding, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { ShareSheetComponent } from '../components/share-sheet/share-sheet.component';
import { AuthenticationService } from '../services/authentication.service';
import { ComplaintService } from '../services/complaint.service';
import { TestimonyService } from '../services/testimony.service';
import { UserService } from '../services/user.service';
import { VoteDialogComponent } from '../components/vote-dialog/vote-dialog.component';
import { UtilityService } from '../services/utility.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SinglePostDialogComponent } from './components/single-post-dialog/single-post-dialog.component';
import { PostsService } from '../services/posts.service';
import { VoteService } from '../services/vote.service';
import { FavoritesService } from '../services/favorites.service';

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
  public today: any = null;
  public posts: any = null;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public authenticationService: AuthenticationService,
    public testimonyService: TestimonyService,
    public complaintService: ComplaintService,
    public userService: UserService,
    public utilityService: UtilityService,
    public matBottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public postsService: PostsService,
    public voteService: VoteService,
    public favoritesService: FavoritesService
  ) {
    // console.log(this.authenticationService.isAuthenticated);
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.today = new Date();

    this.userService.fetchFireUser().subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.user = reply; },
      complete: () => { }
    });

    this.postsService.fetchAllPosts({ limit: 100, page: 1 }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.posts = reply[0]['data'];
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
      },
      complete: () => {
        this.isDataAvailable = true;
        // console.log(this.posts);
      }
    });
  }

  postComment(event: any, card: any) {
    if (event.keyCode === 13) {
      console.log(this.user);
      let obj: any = {
        message: event['target']['value'],
        createdBy: this.user
      }
      card['comments'].push(obj);
    }
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
    if (post['card']['vote'] != undefined) {
      this.utilityService.openSuccessSnackBar('Ya votaste');
      return;
    }
    const dialogRef = this.dialog.open<any>(VoteDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { post: post }
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { post['card']['vote'] = reply['data']; }
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

    let panelWidth: string = '';
    let panelClass: string = '';

    switch (this.isMobile) {
      case true:
        panelWidth = '100%';
        panelClass = 'full-dialog';
        break;
      case false:
        panelWidth = '45%';
        panelClass = '';
        break;
    }

    const dialogRef = this.dialog.open<any>(SinglePostDialogComponent, {
      width: panelWidth,
      data: {
        post: post,
        user: this.user
      },
      backdropClass: 'card-backdrop',
      panelClass: panelClass
    });
    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { post = reply; }
    });
  }

  handleFavorite(post: any) {
    if (this.user == null) {
      if (this.isMobile) {
        this.utilityService.linkMe('/hub/signin-mobile');
      } else {
        this.utilityService.linkMe('/hub/ingresar');
      }
      return;
    }

    let data: any = {};

    if (post['card']['favorites'] == undefined) {
      data = { complaint: post['card']['_id'] }
      this.favoritesService.addFavorites(data).subscribe({
        error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
        next: (reply: any) => { post['card']['favorites'] = reply['data']; },
        complete: () => { }
      });
    } else {
      data = { layout: post['card']['favorites']['_id'] }
      this.favoritesService.deleteFavorites(data).subscribe({
        error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
        next: (reply: any) => { post['card']['favorites'] = undefined; },
        complete: () => { }
      });
    }
  }
}
