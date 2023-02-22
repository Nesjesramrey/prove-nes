import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TestimonyService } from 'src/app/services/testimony.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.testimony-dialog',
  templateUrl: './testimony-dialog.component.html',
  styleUrls: ['./testimony-dialog.component.scss']
})
export class TestimonyDialogComponent implements OnInit {
  public submitted: boolean = false;
  public testimonyFormGroup!: FormGroup;
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
  public files: any[] = [];
  public urls = new Array<string>();
  public postURL: string = '';
  @ViewChild('stepper') private stepper!: MatStepper;
  public location: any = {
    latitude: null,
    longitude: null
  }
  public locationAvailable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TestimonyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public testuimonyServive: TestimonyService
  ) {
    // console.log(this.dialogData);
    this.user = this.dialogData['user'];
    if (this.user == null) { this.isAnonymous = true; }
  }

  ngOnInit(): void {
    this.testimonyFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []]
    });
  }

  visibility() {
    this.isAnonymous = !this.isAnonymous;
  }

  onFileSelected(event: any) {
    this.urls = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }

    Array.from(event.target.files)
      .forEach((file: any) => { this.fileNames.push(file['name']); });
    this.testimonyFormGroup.patchValue({ files: event.target.files });
    this.testimonyFormGroup.updateValueAndValidity();

    this.files = event['target']['files'];
    let weight: any = this.validateFileSize(this.files);

    if (weight > 5) {
      this.utilityService.openErrorSnackBar('El peso máximo de carga es de 5MB');
      this.testimonyFormGroup.setErrors({ 'error': true });
      this.submitted = false;
    }
  }

  onFileTestimony(form: FormGroup) {
    this.submitted = true;

    let data: any = {
      formData: new FormData()
    }

    Array.from(this.testimonyFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });
    data['formData'].append('name', this.testimonyFormGroup.value.title);
    data['formData'].append('description', this.testimonyFormGroup.value.description);
    switch (this.locationAvailable) {
      case true:
        data['formData'].append('latitude', this.location['latitude']);
        data['formData'].append('longitude', this.location['longitude']);
        break;
    }
    data['formData'].append('isAnonymous', (this.isAnonymous).toString());

    this.testuimonyServive.createNewTestimony(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
        this, this.killDialog();
      },
      next: (reply: any) => {
        this.postURL = 'https://mexicolectivo.com/posts/' + reply['_id'];
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => {
        this.stepNext();
        this.submitted = false;
        this.testimonyFormGroup.reset();
      }
    });
  }

  popFile(index: number) {
    this.urls = this.urls.filter((x: any, i: any) => { return i != index; });
    this.fileNames = this.fileNames.filter((x: any, i: any) => { return i != index; });
    let files: any = this.testimonyFormGroup.controls['files']['value'];
    files = Array.from(files).filter((x: any, i: any) => { return i != index; });
    this.testimonyFormGroup.patchValue({ files: files });
    this.files = Array.from(this.files).filter((x: any, i: any) => { return i != index; });
    let weight: any = this.validateFileSize(this.files);

    if (weight > 5) {
      this.utilityService.openErrorSnackBar('El peso máximo de carga es de 5MB');
      this.testimonyFormGroup.setErrors({ 'error': true });
      this.submitted = false;
    } else {
      this.testimonyFormGroup.updateValueAndValidity();
    }
  }

  validateFileSize(files: any) {
    let weightArray: any = [];
    Array.from(files).forEach((file: any) => { weightArray.push(file['size'] / (1024 * 1024)); });
    let weight: any = weightArray.reduce((a: any, b: any) => a + b, 0).toFixed(2);
    return weight;
  }

  killDialog() {
    this.dialogRef.close();
  }

  stepNext() {
    this.stepper.next();
  }

  getLocation() {
    this.locationAvailable = !this.locationAvailable;

    switch (this.locationAvailable) {
      case true:
        navigator.geolocation.getCurrentPosition((place: any) => {
          this.location['latitude'] = place.coords.latitude;
          this.location['longitude'] = place.coords.longitude;
        });
        break;

      case false:
        this.location['latitude'] = null;
        this.location['longitude'] = null;
        break;
    }
  }
}
