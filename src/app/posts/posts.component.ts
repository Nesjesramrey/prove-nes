import { Component, HostBinding, Inject, OnInit } from '@angular/core';
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
import { DocumentService } from '../services/document.service';
import { DOCUMENT, Location } from '@angular/common';
import { ComplaintDialogComponent } from '../components/complaint-dialog/complaint-dialog.component';
import { TestimonyDialogComponent } from '../components/testimony-dialog/testimony-dialog.component';
import { TestimonyService } from '../services/testimony.service';
import { ComplaintService } from '../services/complaint.service';

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
  public document: any = null;
  public layouts: any = [];
  public sublayouts: any = [];
  public topics: any = [];
  public solutions: any = [];
  public extensionsAllowed: any = ['mp4', '3gpp', 'mov', 'MP4', 'MOV'];
  public isSearching: boolean = false;
  public routerData: boolean = false;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    public userService: UserService,
    public utilityService: UtilityService,
    public matBottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public postsService: PostsService,
    public voteService: VoteService,
    public favoritesService: FavoritesService,
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    @Inject(DOCUMENT) public DOM: Document,
    public testimonyService: TestimonyService,
    public complainTService: ComplaintService,
    public location: Location
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();
    let posts: Observable<any>;
    let states: Observable<any> = this.utilityService.fetchAllStates();
    let document: Observable<any> = this.documentService.fetchCoverDocument();

    // console.log(history.state);
    if (history.state.topic != undefined) {
      this.routerData = true;
      posts = this.postsService.fetchAllTopicPosts({ limit: 10, page: 1, relation: 'topic', relationId: history.state.topic });
    } else if (history.state.solution != undefined) {
      this.routerData = true;
      posts = this.postsService.fetchAllTopicPosts({ limit: 10, page: 1, relation: 'solution', relationId: history.state.solution });
    }
    else {
      this.routerData = false;
      posts = this.postsService.fetchAllPosts({ limit: 10, page: this.postsPage });
    }

    setTimeout(() => {
      forkJoin([user, posts, states, document]).subscribe({
        error: (error: any) => { },
        next: (reply: any) => {
          // console.log(reply);
          this.user = reply[0];

          this.posts = reply[1][0]['data'];
          this.setPostsCards();

          if (this.user['status'] == undefined) {
            this.updatePostsFavorites();
            this.updatePostsVotes();
          }

          this.states = reply[2];

          this.document = reply[3];
          this.document['layouts'].filter((x: any) => {
            this.layouts.push(x);

            x['subLayouts'].filter((y: any) => {
              this.sublayouts.push(y);

              y['topics'].filter((t: any) => {
                this.topics.push(t);

                t['solutions'].filter((s: any) => {
                  this.solutions.push(s);
                });
              });
            });
          });
        },
        complete: () => {
          this.searchTeamsFG = this.formBuilder.group({
            filter: ['', [Validators.required]],
            coverage: ['', []]
          });

          this.posts.filter((x: any) => {
            if (x['card'] != undefined) {
              if (x['card']['images'] != null) {
                if (x['card']['images'][0] != undefined) {
                  var fileExt = x['card']['images'][0].split('.').pop();
                  if (this.extensionsAllowed.includes(fileExt)) { x['card']['hasVideo'] = true; }
                }
              }
            }
          });

          this.isDataAvailable = true;
          // console.log(this.posts);
        }
      });
    });
  }

  sharePost(post: any) {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user,
        post: post
      },
      panelClass: 'small-sheet'
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
    if (this.user['status'] == 500) {
      this.popUseToolsDialog();
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
      if (x['card'] != undefined) {
        x['card']['favorites'].filter((f: any) => {
          if (f['createdBy'] == this.user['_id']) { x['isFavorite'] = true; }
        });
      }
    });
  }

  updatePostsVotes() {
    this.posts.filter((x: any) => {
      if (x['card'] != undefined) {
        x['card']['vote'].filter((f: any) => {
          if (f['createdBy'] == this.user['_id']) { x['voted'] = true; }
        });
      }
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
        case 'topic':
          // console.log(x);
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
    this.isSearching = true;

    let data: any = {
      filter: form['value']['filter'],
      coverage: form['value']['coverage'],
    };

    this.postsService.filterPosts(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.isSearching = false;
      },
      next: (reply: any) => {
        // console.log(reply);
        if (reply[0]['data'].length == 0) {
          this.utilityService.openErrorSnackBar('No hay resultados para tu busqueda.');
          return;
        }
        this.posts = reply[0]['data'];
        this.setPostsCards();
      },
      complete: () => { this.isSearching = false; }
    });
  }

  linkParent(post: any) {
    if (this.user['status'] == 500) {
      this.popUseToolsDialog();
      return;
    }

    let topic: any = null;
    let layout: any = null;
    let sublayout: any = null;
    let location: string = '';

    switch (post['card']['relation']) {
      case null:
        // console.log('null');
        break;

      case 'topic':
        // console.log('topic');
        topic = this.topics.filter((x: any) => { return x['_id'] == post['card']['relationId']; });
        // console.log(topic);

        this.sublayouts.filter((x: any) => {
          x['topics'].filter((y: any) => {
            if (y['_id'] == topic[0]['_id']) { sublayout = x; }
          });
        });
        // console.log(sublayout);

        this.layouts.filter((x: any) => {
          x['subLayouts'].filter((y: any) => {
            if (y['_id'] == sublayout['_id']) { layout = x; }
          });
        });
        // console.log(layout);

        location =
          `/documentos-publicos/${this.document['_id']}/categoria/${layout['_id']}/subcategoria/${sublayout['_id']}/tema/${topic[0]['_id']}`;
        this.utilityService.linkMe(location);
        break;

      case 'solution':
        let solution: any = this.solutions.filter((x: any) => { return x['_id'] == post['card']['relationId']; });
        // console.log(solution);

        this.topics.filter((x: any) => {
          x['solutions'].filter((y: any) => {
            if (y['_id'] == solution[0]['_id']) { topic = x; }
          });
        });
        // console.log(topic);

        this.sublayouts.filter((x: any) => {
          x['topics'].filter((y: any) => {
            if (y['_id'] == topic['_id']) { sublayout = x; }
          });
        });
        // console.log(sublayout);

        this.layouts.filter((x: any) => {
          x['subLayouts'].filter((y: any) => {
            if (y['_id'] == sublayout['_id']) { layout = x; }
          });
        });
        // console.log(layout);

        location =
          `/documentos-publicos/${this.document['_id']}/categoria/${layout['_id']}/subcategoria/${sublayout['_id']}/tema/${topic['_id']}/solucion/${solution[0]['_id']}`;
        this.utilityService.linkMe(location);
        break;
    }
  }

  popComplaintsDialog() {
    const dialogRef = this.dialog.open<any>(ComplaintDialogComponent, {
      width: '100%',
      data: {
        user: this.user
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popTestimonialsDialog() {
    const dialogRef = this.dialog.open<any>(TestimonyDialogComponent, {
      width: '100%',
      data: {
        user: this.user
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
