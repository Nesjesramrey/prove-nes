import { Component, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-document-topic-full',
  templateUrl: './add-document-topic-full.component.html',
  styleUrls: ['./add-document-topic-full.component.scss']
})
export class AddDocumentTopicFullComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public layouts: any[] = [];
  public sublayouts: any[] = [];
  public submitted: boolean = false;
  public addTopicFormGroup!: FormGroup;
  public document: any = null;
  public coverage: any = null;
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
  public fileNames: any[] = [];
  public topic: any = null;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentTopicFullComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public topicService: TopicService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.addTopicFormGroup = this.formBuilder.group({
      coverage: ['', [Validators.required]],
      layout: ['', [Validators.required]],
      sublayout: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []]
    });

    this.addTopicFormGroup.get('sublayout')?.disable();
    this.addTopicFormGroup.get('title')?.disable();
    this.addTopicFormGroup.get('description')?.disable();

    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.document = reply;
        this.coverage = reply['coverage'];
        this.layouts = reply['layouts'];
      },
      complete: () => {
        this.isDataAvailable = true;
      }
    })
  }

  onLayoutSelected(event: any) {
    this.sublayouts = event['value']['subLayouts'];
    this.addTopicFormGroup.get('sublayout')?.enable();
    this.addTopicFormGroup.get('title')?.enable();
    this.addTopicFormGroup.get('description')?.enable();
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.addTopicFormGroup.patchValue({ files: event.target.files });
    this.addTopicFormGroup.updateValueAndValidity();
  }

  onCreateTopic(formGroup: FormGroup) {
    this.submitted = true;

    let data: any = {
      layout_id: formGroup['value']['sublayout']['_id'],
      formData: new FormData()
    };

    Array.from(this.addTopicFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });
    data['formData'].append('title', formGroup['value']['title']);
    data['formData'].append('description', formGroup['value']['description']);
    data['formData'].append('coverage', JSON.stringify([formGroup['value']['coverage']['_id']]));

    this.topicService.createNewTopic(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        this.topic = reply['topics'][0];
        this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
      },
      complete: () => {
        this.submitted = false;
        this.dialogRef.close(this.topic);
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
