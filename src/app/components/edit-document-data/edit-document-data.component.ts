import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.edit-document-data-dialog',
  templateUrl: './edit-document-data.component.html',
  styleUrls: ['./edit-document-data.component.scss']
})
export class EditDocumentDataComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public documentID: string = '';
  public document: any = null;
  public documentImages: any = null;
  public updatedImages: any[] = [];
  public formGroup!: FormGroup;
  public submitted: boolean = false;
  public htmlContent: any = '';
  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Descripción...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };
  public displaySaveImagesControl: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentServie: DocumentService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.documentID = this.dialogData['document']['_id'];
  }

  ngOnInit(): void {
    this.documentServie.fetchSingleDocumentById({ _id: this.documentID }).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
      },
      next: (reply: any) => {
        this.document = reply;
        this.documentImages = reply['images'];
      },
      complete: () => {
        this.formGroup = this.formBuilder.group({
          title: [this.document['title'], [Validators.required]],
          description: [this.document['description'], [Validators.required]]
        });
        this.isDataAvailable = true;
      }
    });
  }

  editDocument(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      documentID: this.document['_id'],
      title: formGroup['value']['title'],
      description: formGroup['value']['description']
    };

    this.documentServie.editDocumentData(data).subscribe({
      error: (error: any) => {
        this.submitted = true;
        // console.log(error);
      },
      next: (reply: any) => {
        this.submitted = true;
        this.dialogRef.close(reply);
      },
      complete: () => { }
    })
  }

  killImage(index: number) {
    this.displaySaveImagesControl = true;
    let image = this.documentImages[index];
    this.updatedImages.push(image.substring(image.lastIndexOf('/') + 1));
    // this.documentImages.splice(index, 1);
  }

  updateDocumentImages() {
    this.submitted = true;
    let data: any = {
      document_id: this.documentID,
      images: this.updatedImages
    }
    this.documentServie.killDocumentImage(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => {
        this.displaySaveImagesControl = false;
        this.submitted = false;
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
