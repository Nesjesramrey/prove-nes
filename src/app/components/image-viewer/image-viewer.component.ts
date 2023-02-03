import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.image-viewer-dialog',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public document: any = null;
  public layout: any = null;
  public topic: any = null;
  public solution: any = null;
  public filesFormGroup!: FormGroup;
  public fileNames: any = [];
  public submitted: boolean = false;
  public user: any = null;
  public complaint: any = null;

  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public utilityService: UtilityService,
    public layoutService: LayoutService,
    public topicService: TopicService,
    public solutionService: SolutionService
  ) {
    // console.log(this.dialogData);
    this.document = this.dialogData['document'];
    this.layout = this.dialogData['layout'];
    this.topic = this.dialogData['topic'];
    this.solution = this.dialogData['solution'];
    this.user = this.dialogData['user'];
    this.user['activityName'] = this.user['activities'][0]['value'];
    this.complaint = this.dialogData['complaint'];
    // console.log(this.user);

    switch (this.dialogData['location']) {
      case 'document':
        // console.log('document: ', this.document);
        break;

      case 'layout':
        // console.log('layout: ', this.layout);
        break;

      case 'topic':
        // console.log('topic: ', this.topic);
        break;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.filesFormGroup = this.formBuilder.group({
        files: ['', [Validators.required]]
      });
      this.isDataAvailable = true;
    }, 300);
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.filesFormGroup.patchValue({ files: event.target.files });
    this.filesFormGroup.updateValueAndValidity();

    setTimeout(() => {
      this.onUploadFiles();
    }, 300);
  }

  onUploadFiles() {
    this.submitted = true;
    let data: any = {
      formData: new FormData()
    }

    Array.from(this.filesFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });

    switch (this.dialogData['location']) {
      case 'document':
        data.document_id = this.document['_id'];
        this.documentService.uploadDocumentFiles(data).subscribe({
          error: (error: any) => {
            // console.log(error);
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
          },
          next: (reply: any) => {
            // console.log(reply);
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
            this.document['images'] = reply['images'];
          },
          complete: () => {
            this.submitted = false;
          }
        });
        break;

      case 'layout':
        data.layout_id = this.layout['_id'];
        this.layoutService.uploadLayoutFiles(data).subscribe({
          error: (error: any) => {
            // console.log(error);
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
          },
          next: (reply: any) => {
            // console.log(reply);
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
            this.layout['images'] = reply['images'];
          },
          complete: () => {
            this.submitted = false;
          }
        });
        break;

      case 'topic':
        data.topic_id = this.topic['_id'];
        this.topicService.uploadTopicFiles(data).subscribe({
          error: (error: any) => {
            // console.log(error);
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
          },
          next: (reply: any) => {
            // console.log(reply);
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
            this.topic['images'] = reply['images'];
          },
          complete: () => {
            this.submitted = false;
          }
        })
        break;

      case 'solution':
        data.solution_id = this.solution['_id'];
        this.solutionService.uploadSolutionFiles(data).subscribe({
          error: (error: any) => {
            // console.log(error);
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
          },
          next: (reply: any) => {
            // console.log(reply);
            this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
            this.solution['images'] = reply['images'];
          },
          complete: () => {
            this.submitted = false;
          }
        });
        break;
    };
  }

  killDialog() {
    this.dialogRef.close();
  }
}
