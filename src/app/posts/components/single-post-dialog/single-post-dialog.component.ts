import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';
import { FavoritesService } from 'src/app/services/favorites.service';
import { PostsService } from 'src/app/services/posts.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.single-post-dialog',
  templateUrl: './single-post-dialog.component.html',
  styleUrls: ['./single-post-dialog.component.scss']
})
export class SinglePostDialogComponent implements OnInit {
  public post: any = null;
  public user: any = null;
  public isDataAvailable: boolean = false;
  public commentForm!: FormGroup;
  public postComments: any = [];
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';
  public submitted: boolean = false;
  public url: string = '';
  public obj: any = null;
  public routerData: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SinglePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialog: MatDialog,
    public matBottomSheet: MatBottomSheet,
    public formBuilder: FormBuilder,
    public favoritesService: FavoritesService,
    public utilityService: UtilityService,
    public postsService: PostsService,
    public deviceDetectorService: DeviceDetectorService,
    @Inject(DOCUMENT) public DOM: Document,
    public router: Router
  ) {
    // console.log(this.dialogData);
    this.post = this.dialogData['post'];
    this.postComments = this.post['postComments'];
    this.user = this.dialogData['user'];

    switch (this.post['relation']) {
      case 'complaint':
        this.post['card'] = this.post['complaint'][0]
        break;
      case 'testimony':
        this.post['card'] = this.post['testimony'][0]
        break;
    }

    if (this.post['card'] != undefined) {
      if (this.post['card']['images'] != null) {
        if (this.post['card']['images'][0] != undefined) {
          var fileExt = this.post['card']['images'][0].split('.').pop();
          if (fileExt == 'mp4' || fileExt == '3gpp' || fileExt == 'mov') {
            this.post['card']['hasVideo'] = true;
          }
        }
      }
    } else {
      this.routerData = true;
    }

    // console.log(this.post);
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
    this.url = this.DOM.location.origin + this.router.url;
    this.obj = this.dialogData['obj'];
  }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 300);
  }

  openVoteDialog(post: any) {
    if (post['card']['vote'] != undefined) {
      this.utilityService.openSuccessSnackBar('Ya votaste');
      return;
    }

    const dialogRef = this.dialog.open<any>(VoteDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { post: this.getPostID(this.post) }
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        post['card']['vote'] = reply['data'];
      }
    });
  }

  sharePost(post: any) {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: null,
        post: post
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  getPostID(post: any) {
    let postID: any = '';
    switch (post['relation']) {
      case 'testimony':
        postID = post['testimony'][0]['_id'];
        break;
      case 'complaint':
        postID = post['complaint'][0]['_id'];
        break;
    }
    return postID;
  }

  onComment(form: FormGroup) {
    this.submitted = true;
    let owner: any = '';
    let ownerEmail: any = '';
    let postTitle: any = '';

    if (this.post['card']['createdBy'] != undefined) {
      owner = this.post['card']['createdBy']['firstname'] + ' ' + this.post['card']['createdBy']['lastname'];
      ownerEmail = this.post['card']['createdBy']['email'];
    } else {
      owner = 'Anónimo';
      ownerEmail = null;
    }

    switch (this.post['relation']) {
      case 'complaint':
        postTitle = this.post['card']['title']
        break;
      case 'testimony':
        postTitle = this.post['card']['name']
        break;
    }

    let data: any = {
      postID: this.post['card']['_id'],
      message: form['value']['comment'],
      owner: owner,
      ownerEmail: ownerEmail,
      postTitle: postTitle,
      redirectURL: this.url + '/' + this.post['card']['_id']
    };

    this.postsService.addPostComment(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.submitted = false;
      },
      next: (reply: any) => { this.postComments.unshift(reply); },
      complete: () => {
        this.commentForm.reset();
        this.submitted = false;
      }
    });
  }

  handleFavorite(post: any) {
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

  killDialog() {
    this.dialogRef.close(this.post);
  }
}
