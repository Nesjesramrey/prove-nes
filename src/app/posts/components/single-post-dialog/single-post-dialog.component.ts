import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';

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

  constructor(
    public dialogRef: MatDialogRef<SinglePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialog: MatDialog,
    public matBottomSheet: MatBottomSheet,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.dialogData);
    this.post = this.dialogData['post'];
    this.user = this.dialogData['user'];
    switch (this.post['relation']) {
      case 'complaint':
        this.post['card'] = this.post['complaint'][0]
        break;
      case 'testimony':
        this.post['card'] = this.post['testimony'][0]
        break;
    }
    // console.log(this.post);
  }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]]
    });
  }

  openVoteDialog(post: any) {
    const dialogRef = this.dialog.open<any>(VoteDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        post: this.getPostID(this.post)
      },
    });

    dialogRef.afterClosed().subscribe((reply: any) => { });
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
    let data: any = {
      userName: this.user['firstname'] + ' ' + this.user['lastname'],
      avatarImage: this.user['avatarImage'],
      text: form['value']['comment']
    };
    console.log(data);
    this.postComments.unshift(data);
    this.commentForm.reset();
  }

  killDialog() {
    this.dialogRef.close();
  }
}
