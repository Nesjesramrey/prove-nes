import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-comments-dialog',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.scss']
})
export class AddCommentsComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public commentFormGroup!: FormGroup;
  public submitted: boolean = false;
  public documentLocation: any = null;
  public locationID: any = null;
  public documentID: any = null;
  public document: any = null;
  public layout: any = null;
  public topic: any = null;
  public solution: any = null;
  public coverage: any = null;
  public isAnonymous: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public router: Router,
    public commentService: CommentService
  ) {
    // console.log(this.dialogData);
    this.documentLocation = this.dialogData['location'];
    this.coverage = this.dialogData['coverage'] || null;
    // console.log(this.coverage);

    switch (this.dialogData['location']) {
      case 'document':
        this.document = this.dialogData['document'];
        this.locationID = this.dialogData['document']['_id'];
        break;

      case 'layout':
        this.document = this.dialogData['document'];
        this.documentID = this.document['_id'];
        this.layout = this.dialogData['layout'];
        this.locationID = this.dialogData['layout']['_id'];
        break;

      case 'subLayout':
        this.document = this.dialogData['document'];
        this.documentID = this.document['_id'];
        this.layout = this.dialogData['layout'];
        this.locationID = this.dialogData['layout']['_id'];
        break;

      case 'topic':
        this.document = this.dialogData['document'];
        this.documentID = this.document['_id'];
        this.topic = this.dialogData['topic'];
        this.locationID = this.dialogData['topic']['_id'];
        break;

      case 'solution':
        this.document = this.dialogData['document'];
        this.documentID = this.document['_id'];
        this.solution = this.dialogData['solution'];
        this.locationID = this.dialogData['solution']['_id'];
        break;
    }
  }

  ngOnInit(): void {
    this.commentFormGroup = this.formBuilder.group({
      message: ['', [Validators.required]],
      file: ['', []]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  onFileSelected(event: any) {
    this.validateSize(event.target);
  }

  validateSize(input: any) {
    const fileSize = input.files[0].size / 1024 / 1024;
    if (fileSize > 3) {
      this.utilityService.openErrorSnackBar('Solo archivos de hasta 3 MB.');
    } else {
      this.commentFormGroup.patchValue({ file: input.files[0] });
      this.commentFormGroup.updateValueAndValidity();
    }
  }

  onComment(formGroup: FormGroup) {
    this.submitted = true;
    let url = this.router['url'];
    url = url.replace('/documentos-publicos/', '/documentos/');
    url = url.replace('/tema/', '/temas/');

    let data: any = {
      location: this.documentLocation,
      document_id: this.documentID,
      location_id: this.locationID,
      formData: new FormData(),
    };

    data['formData'].append('file', this.commentFormGroup.controls['file']['value']);
    data['formData'].append('message', formGroup['value']['message']);
    data['formData'].append('coverage', JSON.stringify([this.coverage['_id']]));
    data['formData'].append('isAnonymous', this.isAnonymous);
    data['formData'].append('redirectURL', url);

    switch (this.documentLocation) {
      case 'document':
        this.commentService.createNewDocumentComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
          },
          complete: () => {
            this.killDialog();
          }
        });
        break;

      case 'layout':
        this.commentService.createNewLayoutComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
          },
          complete: () => {
            this.killDialog();
          }
        });
        break;

      case 'subLayout':
        this.commentService.createNewSubLayoutComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
          },
          complete: () => {
            this.killDialog();
          }
        });
        break;

      case 'topic':
        this.commentService.createNewTopicComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
          },
          complete: () => {
            this.killDialog();
          }
        });
        break;

      case 'solution':
        this.commentService.createNewSolutionComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killDialog();
          },
          next: (reply: any) => {
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
          },
          complete: () => {
            this.killDialog();
          }
        })
        break;
    }
  }

  killDialog() {
    this.dialogRef.close();
  }
}
