import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.view-message-dialog',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.scss']
})
export class ViewMessageComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public notification: any = null;
  public comment: any = null;

  constructor(
    public dialogRef: MatDialogRef<ViewMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public commentService: CommentService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.notification = this.dialogData['notification'];
  }

  ngOnInit(): void {
    this.commentService.fetchCommentById(
      {
        comment_id: this.notification['metadata']['referenceId']
      }).subscribe({
        error: (error: any) => {
          this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
          this.killDialog();
        },
        next: (reply: any) => {
          this.comment = reply;
        },
        complete: () => {
          setTimeout(() => {
            this.isDataAvailable = true;
          }, 1000);
        }
      });
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
    this.killDialog();
  }

  killDialog() {
    this.dialogRef.close();
  }
}
