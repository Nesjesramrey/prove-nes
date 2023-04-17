import { Component, HostBinding, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { forkJoin, Observable } from 'rxjs';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';
import { FavoritesService } from 'src/app/services/favorites.service';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { SinglePostDialogComponent } from '../components/single-post-dialog/single-post-dialog.component';

@Component({
  selector: '.single-post-page',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  public postID: string = '';
  public isDataAvailable: boolean = false;
  public user: any = null;
  public post: any = null;
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    public postsService: PostsService,
    public userService: UserService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public matBottomSheet: MatBottomSheet,
    public favoritesService: FavoritesService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.postID = this.activatedRoute['snapshot']['params']['postID'];
    // console.log(this.postID);
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();
    let post: Observable<any> = this.postsService.fetchPostByRelationId({ relationId: this.postID });
    forkJoin([user, post]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.user = reply[0];

        this.post = reply[1][0];
        switch (this.post['relation']) {
          case 'complaint':
            this.post['card'] = this.post['complaint'][0];
            break;
          case 'testimony':
            this.post['card'] = this.post['testimony'][0];
            break;
        }

        if (this.post['card']['images'] != null) {
          if (this.post['card']['images'][0] != undefined) {
            var fileExt = this.post['card']['images'][0].split('.').pop();
            if (fileExt == 'mp4' || fileExt == '3gpp' || fileExt == 'mov') {
              this.post['card']['hasVideo'] = true;
            }
          }
        }

        if (this.user['status'] == undefined) {
          this.post['card']['favorites'].filter((f: any) => {
            if (f['createdBy'] == this.user['_id']) { this.post['isFavorite'] = true; }
          });
          this.post['card']['vote'].filter((f: any) => {
            if (f['createdBy'] == this.user['_id']) { this.post['voted'] = true; }
          });
        }
      },
      complete: () => {
        this.isDataAvailable = true;
        // console.log(this.post);
      }
    });
  }

  sharePost(post: any) {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user,
        // post: post
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
        this.post['card']['vote'].filter((f: any) => {
          if (f['createdBy'] == this.user['_id']) { this.post['voted'] = true; }
        });
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
            this.post['card']['favorites'].filter((f: any) => {
              if (f['createdBy'] == this.user['_id']) { this.post['isFavorite'] = true; }
            });
          },
          complete: () => { }
        });
        break;
    }
  }
}
