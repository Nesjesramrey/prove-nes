import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TestimonyService } from 'src/app/services/testimony.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss']
})
export class TestimonialListComponent implements OnInit {
  public location: string = '';
  public topic: any = null;
  public solution: any = null;
  public testimonials: any[] = [];
  public user: any = null;
  public submitted: boolean = false;
  public addTestimonyFormGroup!: FormGroup;
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

  constructor(
    public dialogRef: MatDialogRef<TestimonialListComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public testimonyService: TestimonyService,
    public utilityService: UtilityService
  ) {
    console.log(this.dialogData);
    this.location = this.dialogData['location'];
    this.user = this.dialogData['user'];
  }

  ngOnInit(): void {
    this.addTestimonyFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []]
    });

    switch (this.location) {
      case 'topic':
        this.topic = this.dialogData['topic'];
        this.testimonials = this.topic['testimonials'];
        break;

      case 'solution':
        this.solution = this.dialogData['solution'];
        this.testimonials = this.solution['testimonials'];
        break;
    }
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
    this.addTestimonyFormGroup.patchValue({ files: event.target.files });
    this.addTestimonyFormGroup.updateValueAndValidity();
    // console.log(this.addTestimonyFormGroup.controls['files']['value']);
  }

  visibility() {
    this.isAnonymous = !this.isAnonymous;
  }

  createTestimony() {
    this.submitted = true;
    const { topicID, location } = this.dialogData;

    let data = {
      formData: new FormData(),
      id: topicID,
      type: location
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
        console.log(reply);
        // this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  killDialog() { this.dialogRef.close(); }
}
