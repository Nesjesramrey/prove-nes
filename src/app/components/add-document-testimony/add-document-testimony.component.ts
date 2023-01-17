import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDocumentThemeComponent } from '../add-document-theme/add-document-theme.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestimonyService } from 'src/app/services/testimony.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UtilityService } from 'src/app/services/utility.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-add-document-testimony',
  templateUrl: './add-document-testimony.component.html',
  styleUrls: ['./add-document-testimony.component.scss'],
})
export class AddDocumentTestimonyComponent implements OnInit {
  public addTestimonyFormGroup!: FormGroup;
  public imageUrl: string | null = null;
  public submitted = false;
  public file: any = null;
  public messageError: boolean = false;
  public isAnonymous: boolean = false;
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
  public user: any = null;
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public testimonyService: TestimonyService,
    public utilityService: UtilityService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    // console.log(this.dialogData);
    this.user = this.dialogData['user'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.addTestimonyFormGroup = this.formBuilder.group({
      description: ['', [Validators.required]],
      files: ['', []],
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  visibility() {
    this.isAnonymous = !this.isAnonymous;
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.addTestimonyFormGroup.patchValue({ files: event.target.files });
    this.addTestimonyFormGroup.updateValueAndValidity();
    // console.log(this.addTestimonyFormGroup.controls['files']['value']);
  }

  createTestimony() {
    this.submitted = true;
    const { topicID, type } = this.dialogData;

    let data = {
      formData: new FormData(),
      id: topicID,
      type: type
    };

    Array.from(this.addTestimonyFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });
    data['formData'].append('description', this.addTestimonyFormGroup.value.description);
    data['formData'].append('isAnonymous', (this.isAnonymous).toString());

    this.testimonyService.createNewTestimony(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
        this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }
}
