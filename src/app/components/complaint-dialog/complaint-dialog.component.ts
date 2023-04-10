import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ComplaintService } from 'src/app/services/complaint.service';
import { UploadService } from 'src/app/services/upload.service';
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
  public files: any[] = [];
  public urls = new Array<string>();
  public postURL: string = '';
  @ViewChild('stepper') private stepper!: MatStepper;
  public location: any = {
    latitude: null, longitude: null
  }
  public locationAvailable: boolean = false;
  public isMobile: boolean = false;
  public url: string = '';

  constructor(
    public dialogRef: MatDialogRef<ComplaintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public complaintService: ComplaintService,
    public utilityService: UtilityService,
    public deviceDetectorService: DeviceDetectorService,
    @Inject(DOCUMENT) public DOM: Document,
    public router: Router,
    public uploadService: UploadService
  ) {
    // console.log(this.dialogData);
    this.user = this.dialogData['user'];
    if (this.user == null) { this.isAnonymous = true; }
    this.isMobile = this.deviceDetectorService.isMobile();
    this.url = this.DOM.location.origin + this.router.url;
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
    this.complaintFormGroup.patchValue({ files: event.target.files });
    this.complaintFormGroup.updateValueAndValidity();

    this.files = event['target']['files'];
    // let weight: any = this.validateFileSize(this.files);

    // if (weight > 5) {
    //   this.utilityService.openErrorSnackBar('El peso máximo de carga es de 5MB');
    //   this.complaintFormGroup.setErrors({ 'error': true });
    //   this.submitted = false;
    // }
  }

  onFileComplaint(form: FormGroup) {
    this.submitted = true;
    // let data = new FormData();

    // Array.from(this.complaintFormGroup.controls['files']['value'])
    //   .forEach((file: any) => { data.append('files', file); });
    // data.append('title', this.complaintFormGroup.value.title);
    // data.append('description', this.complaintFormGroup.value.description);
    // switch (this.locationAvailable) {
    //   case true:
    //     data.append('latitude', this.location['latitude']);
    //     data.append('longitude', this.location['longitude']);
    //     break;
    // }
    // data.append('isAnonymous', (this.isAnonymous).toString());

    // this.complaintService.fileComplaint(data).subscribe({
    //   error: (error: any) => {
    //     this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
    //     this.killDialog();
    //   },
    //   next: (reply: any) => {
    //     this.postURL = this.url + '/' + reply['_id'];
    //     this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
    //   },
    //   complete: () => {
    //     this.locationAvailable = false;
    //     this.location['latitude'] = null;
    //     this.location['longitude'] = null;
    //     this.stepNext();
    //     this.submitted = false;
    //     this.complaintFormGroup.reset();
    //   }
    // });

    let data: any = {
      files: this.complaintFormGroup.controls['files']['value'],
      title: this.complaintFormGroup.value.title,
      description: this.complaintFormGroup.value.description,
      isAnonymous: this.isAnonymous,
      type: 'complaint'
    }

    this.uploadService.injectPayload(data);
    this.killDialog();
  }

  popFile(index: number) {
    this.urls = this.urls.filter((x: any, i: any) => { return i != index; });
    this.fileNames = this.fileNames.filter((x: any, i: any) => { return i != index; });
    let files: any = this.complaintFormGroup.controls['files']['value'];
    files = Array.from(files).filter((x: any, i: any) => { return i != index; });
    this.complaintFormGroup.patchValue({ files: files });
    this.files = Array.from(this.files).filter((x: any, i: any) => { return i != index; });
    let weight: any = this.validateFileSize(this.files);

    if (weight > 5) {
      this.utilityService.openErrorSnackBar('El peso máximo de carga es de 5MB');
      this.complaintFormGroup.setErrors({ 'error': true });
      this.submitted = false;
    } else {
      this.complaintFormGroup.updateValueAndValidity();
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
        setTimeout(() => {
          navigator.geolocation.getCurrentPosition((place: any) => {
            this.location['latitude'] = place.coords.latitude;
            this.location['longitude'] = place.coords.longitude;
          });
        });
        break;

      case false:
        this.location['latitude'] = null;
        this.location['longitude'] = null;
        break;
    }
  }
}
