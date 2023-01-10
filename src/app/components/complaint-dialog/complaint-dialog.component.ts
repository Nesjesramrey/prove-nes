import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ComplaintService } from 'src/app/services/complaint.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.complaint-dialog',
  templateUrl: './complaint-dialog.component.html',
  styleUrls: ['./complaint-dialog.component.scss']
})
export class ComplaintDialogComponent implements OnInit {
  public submitted: boolean = false;
  public complaintFormGroup!: FormGroup;
  public isAnonymous: boolean = false;
  public user: any = null;
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
  public fileNames: any = [];

  constructor(
    public dialogRef: MatDialogRef<ComplaintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public complaintService: ComplaintService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.user = this.dialogData['user'];
  }

  ngOnInit(): void {
    this.complaintFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []]
    });
  }

  visibility() {
    this.isAnonymous = !this.isAnonymous;
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.complaintFormGroup.patchValue({ files: event.target.files });
    this.complaintFormGroup.updateValueAndValidity();
    // console.log(this.complaintFormGroup.controls['files']['value']);
  }

  onFileComplaint(form: FormGroup) {
    this.submitted = true;
    let data = new FormData();

    Array.from(this.complaintFormGroup.controls['files']['value'])
      .forEach((file: any) => { data.append('files', file); });
    data.append('title', this.complaintFormGroup.value.title);
    data.append('description', this.complaintFormGroup.value.description);
    data.append('isAnonymous', (this.isAnonymous).toString());

    this.complaintService.fileComplaint(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => {
        this.killDialog();
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
