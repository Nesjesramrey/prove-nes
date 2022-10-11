import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.reply-document-comments',
  templateUrl: './reply-document-comments.component.html',
  styleUrls: ['./reply-document-comments.component.scss']
})
export class ReplyDocumentCommentsComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public document: any = null;
  public comment: any = null;
  public submitted: boolean = false;
  public replyFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReplyDocumentCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public router: Router,
    public commentService: CommentService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.document = this.dialogData['document'];
    this.comment = this.dialogData['comment'];
  }

  ngOnInit(): void {
    this.replyFormGroup = this.formBuilder.group({
      message: ['', [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  onReplyComment(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      comment_id: this.comment['_id'],
      message: formGroup['value']['message'],
      redirectURL: this.router['url']
    };
    this.commentService.replyDocumentComments(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.submitted = false
      },
      next: (reply: any) => {
        this.submitted = false;
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
