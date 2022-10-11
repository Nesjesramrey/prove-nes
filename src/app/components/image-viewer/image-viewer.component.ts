import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
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
  public filesFormGroup!: FormGroup;
  public fileNames: any = [];
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public utilityService: UtilityService,
    public layoutService: LayoutService
  ) {
    console.log(this.dialogData);
    this.document = this.dialogData['document'];
    this.layout = this.dialogData['layout'];
    this.topic = this.dialogData['topic']

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
    }, 1000);
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
            this.utilityService.openErrorSnackBar('Oops!... Ocurrió un error, inténtalo más tarde.');
          },
          next: (reply: any) => {
            // console.log(reply);
            this.utilityService.openSuccessSnackBar('El documento se actualizó correctamente.');
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
            this.utilityService.openErrorSnackBar('Oops!... Ocurrió un error, inténtalo más tarde.');
          },
          next: (reply: any) => {
            // console.log(reply);
            this.utilityService.openSuccessSnackBar('La categoría se actualizó correctamente.');
            this.layout['images'] = reply['images'];
          },
          complete: () => { }
        });
        break;
    };
  }

  killDialog() {
    this.dialogRef.close();
  }
}
