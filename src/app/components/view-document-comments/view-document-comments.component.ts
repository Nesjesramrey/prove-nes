import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment.service';
import { UtilityService } from 'src/app/services/utility.service';

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

  constructor(
    public dialogRef: MatDialogRef<ViewDocumentCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public commentService: CommentService,
    public utilityService: UtilityService
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
            setTimeout(() => {
              this.isDataAvailable = true;
            }, 1000);
          },
          complete: () => { }
        });
        break;
    }
  }

  killDialog() {
    this.dialogRef.close();
  }
}
