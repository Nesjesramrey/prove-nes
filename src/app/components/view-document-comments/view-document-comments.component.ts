import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ReplyDocumentCommentsComponent } from '../reply-document-comments/reply-document-comments.component';

@Component({
  selector: '.view-document-comments',
  templateUrl: './view-document-comments.component.html',
  styleUrls: ['./view-document-comments.component.scss']
})
export class ViewDocumentCommentsComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public documentLocation: string = '';
  public comments: any = []
  public document: any = null;
  public layout: any = null;
  public topic: any = null;
  public solution: any = null;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ViewDocumentCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public commentService: CommentService,
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) {
    // console.log(this.dialogData);
    this.documentLocation = this.dialogData['location'];
    this.document = this.dialogData['document'];
  }

  ngOnInit(): void {
    let data: any = {};

    switch (this.documentLocation) {
      case 'document':
        this.commentService.fetchDocumentComments({ location_id: this.document['_id'] })
          .subscribe({
            error: (error: any) => {
              this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
              this.killDialog();
            },
            next: (reply: any) => {
              this.comments = reply;
              this.setCommentViewReply(this.comments);
              setTimeout(() => {
                this.isDataAvailable = true;
              }, 1000);
            },
            complete: () => { }
          });
        break;

      case 'layout':
        this.layout = this.dialogData['layout'];
        data = {
          document_id: this.document['_id'],
          location_id: this.layout['_id']
        }
        this.commentService.fetchLayoutComments(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.comments = reply;
            this.setCommentViewReply(this.comments);
            setTimeout(() => {
              this.isDataAvailable = true;
            }, 1000);
          },
          complete: () => { }
        });
        break;

      case 'subLayout':
        this.layout = this.dialogData['layout'];
        data = {
          document_id: this.document['_id'],
          location_id: this.layout['_id']
        }
        this.commentService.fetchLayoutComments(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.comments = reply;
            this.setCommentViewReply(this.comments);
            setTimeout(() => {
              this.isDataAvailable = true;
            }, 1000);
          },
          complete: () => { }
        });
        break;

      case 'topic':
        this.topic = this.dialogData['topic'];
        data = {
          document_id: this.document['_id'],
          location_id: this.topic['_id']
        }
        this.commentService.fetchTopicComments(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.comments = reply;
            this.setCommentViewReply(this.comments);
            setTimeout(() => {
              this.isDataAvailable = true;
            }, 1000);
          },
          complete: () => { }
        });
        break;

      case 'solution':
        this.solution = this.dialogData['solution'];
        data = {
          document_id: this.document['_id'],
          location_id: this.solution['_id']
        }
        this.commentService.fetchSolutionComments(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.comments = reply;
            this.setCommentViewReply(this.comments);
            setTimeout(() => {
              this.isDataAvailable = true;
            }, 1000);
          },
          complete: () => { }
        });
        break;
    }
  }

  popReplyCommentDialog(comment: any) {
    const dialogRef = this.dialog.open<ReplyDocumentCommentsComponent>(ReplyDocumentCommentsComponent, {
      width: '640px',
      data: {
        document: this.document,
        comment: comment
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
        comment['comments'] = reply['comments'];
      }
    });
  }

  killComment(comment: any) {
    this.submitted = true;

    this.commentService.killDocumentComment({ comment_id: comment['_id'] }).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.editedSuccess);
        this.comments = this.comments.filter((x: any) => { return x['_id'] != comment['_id'] });
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  setCommentViewReply(array: any) {
    array.filter((x: any) => { x['viewReply'] = false; });
  }

  viewReply(comment: any) {
    comment['viewReply'] = !comment['viewReply'];
  }

  killDialog() {
    this.dialogRef.close();
  }
}
