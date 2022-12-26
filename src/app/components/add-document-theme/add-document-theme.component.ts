import { Component, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';
import { SolutionService } from 'src/app/services/solution.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: '.add-document-theme',
  templateUrl: './add-document-theme.component.html',
  styleUrls: ['./add-document-theme.component.scss'],
})
export class AddDocumentThemeComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public imageUrl!: string;
  public addThemeFormGroup!: FormGroup;
  public addSolutionFormGroup!: FormGroup;
  public showThemeForm: boolean = true;
  public showSolutionForm: boolean = false;
  public canAddSolution: boolean = false;
  public submitted: boolean = false;
  @ViewChild('stepper') public stepper!: MatStepper;
  public topic: any = null;
  public fileNames: any = [];
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
  @HostBinding('class') public class: string = '';
  public isMobile: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentThemeComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public topicService: TopicService,
    public utilityService: UtilityService,
    public solutionService: SolutionService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    // console.log(this.dialogData);
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.addThemeFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []]
    });

    this.addSolutionFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []],
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  killDialog() {
    this.dialogRef.close(this.topic);
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.addThemeFormGroup.patchValue({ files: event.target.files });
    this.addThemeFormGroup.updateValueAndValidity();
  }

  onCreateTopic(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      layout_id: this.dialogData['categoryID'],
      formData: new FormData()
    };

    Array.from(this.addThemeFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });
    data['formData'].append('title', form['value']['title']);
    data['formData'].append('description', form['value']['description']);
    data['formData'].append('coverage', JSON.stringify([this.dialogData['coverage']['_id']]));

    this.topicService.createNewTopic(data).subscribe({
      error: (error) => {
        this.utilityService.openErrorSnackBar('¡Oops!... Ocurrió un error, inténtalo más tarde.');
        this.submitted = false;
      },
      next: (reply: any) => {
        console.log(reply);
        this.canAddSolution = true;
        this.submitted = false;
        this.fileNames = []
        this.topic = reply['topics'][0];
        // console.log(this.topic);
      },
      complete: () => { },
    });
  }

  onCreateSolution(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      topic: this.topic['_id'],
      formData: new FormData()
    }

    Array.from(this.addSolutionFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });
    data['formData'].append('title', form['value']['title']);
    data['formData'].append('description', form['value']['description']);
    data['formData'].append('coverage', JSON.stringify([this.dialogData['coverage']['_id']]));

    this.solutionService.createNewSolution(data).subscribe((reply: any) => {
      this.submitted = false;
      this.dialogRef.close({
        topic: this.topic,
        solutions: reply['solutions']
      });
    });
  }
}
