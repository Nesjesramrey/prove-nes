import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TestimonyService } from 'src/app/services/testimony.service';
import { UtilityService } from 'src/app/services/utility.service';
import { TestimonialSingleViewComponent } from '../testimonial-single-view/testimonial-single-view.component';

@Component({
  selector: '.testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss']
})
export class TestimonialListComponent implements OnInit {
  public locationType: string = '';
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
  public files: any[] = [];
  @ViewChild('stepper') public stepper!: MatStepper;
  public selectedIndex: number = 0;
  public location: any = {
    latitude: null,
    longitude: null
  }
  public locationAvailable: boolean = false;
  public isMobile: boolean = false;
  public urls = new Array<string>();
  public postURL: string = '';
  public url: string = '';
  public relationId: string = '';

  constructor(
    public dialogRef: MatDialogRef<TestimonialListComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public testimonyService: TestimonyService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public deviceDetectorService: DeviceDetectorService,
    @Inject(DOCUMENT) public DOM: Document,
    public router: Router
  ) {
    // console.log(this.dialogData);
    this.locationType = this.dialogData['location'];
    this.user = this.dialogData['user'];
    this.isMobile = this.deviceDetectorService.isMobile();
    this.url = this.DOM.location.origin + this.router.url;
  }

  ngOnInit(): void {
    this.addTestimonyFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: ['', []]
    });

    switch (this.locationType) {
      case 'topic':
        this.topic = this.dialogData['topic'];
        this.testimonials = this.topic['testimonials'];
        this.relationId = this.topic['_id'];
        break;

      case 'solution':
        this.solution = this.dialogData['solution'];
        this.testimonials = this.solution['testimonials'];
        this.relationId = this.solution['_id'];
        break;
    }
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
    this.addTestimonyFormGroup.patchValue({ files: event.target.files });
    this.addTestimonyFormGroup.updateValueAndValidity();

    this.files = event['target']['files'];
    let weight: any = this.validateFileSize(this.files);

    if (weight > 5) {
      this.utilityService.openErrorSnackBar('El peso máximo de carga es de 5MB');
      this.addTestimonyFormGroup.setErrors({ 'error': true });
      this.submitted = false;
    }
  }

  visibility() {
    this.isAnonymous = !this.isAnonymous;
  }

  killDialog() { this.dialogRef.close(); }

  stepNext() {
    this.stepper.next();
    this.selectedIndex = this.stepper['selectedIndex'];
  }

  stepPrevious() {
    this.stepper.previous();
    this.selectedIndex = this.stepper['selectedIndex'];
  }

  openTestimonialDialog(testimony: any) {
    const dialogRef = this.dialog.open<any>(TestimonialSingleViewComponent, {
      data: {
        testimony: testimony,
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
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

  popFile(index: number) {
    this.urls = this.urls.filter((x: any, i: any) => { return i != index; });
    this.fileNames = this.fileNames.filter((x: any, i: any) => { return i != index; });
    let files: any = this.addTestimonyFormGroup.controls['files']['value'];
    files = Array.from(files).filter((x: any, i: any) => { return i != index; });
    this.addTestimonyFormGroup.patchValue({ files: files });
    this.files = Array.from(this.files).filter((x: any, i: any) => { return i != index; });
    let weight: any = this.validateFileSize(this.files);

    if (weight > 5) {
      this.utilityService.openErrorSnackBar('El peso máximo de carga es de 5MB');
      this.addTestimonyFormGroup.setErrors({ 'error': true });
      this.submitted = false;
    } else {
      this.addTestimonyFormGroup.updateValueAndValidity();
    }
  }

  validateFileSize(files: any) {
    let weightArray: any = [];
    Array.from(files).forEach((file: any) => { weightArray.push(file['size'] / (1024 * 1024)); });
    let weight: any = weightArray.reduce((a: any, b: any) => a + b, 0).toFixed(2);
    return weight;
  }

  onFileTestimony(form: FormGroup) {
    this.submitted = true;

    let data: any = {
      formData: new FormData()
    }

    Array.from(this.addTestimonyFormGroup.controls['files']['value'])
      .forEach((file: any) => { data['formData'].append('files', file); });
    data['formData'].append('name', this.addTestimonyFormGroup.value.title);
    data['formData'].append('description', this.addTestimonyFormGroup.value.description);
    switch (this.locationAvailable) {
      case true:
        data['formData'].append('latitude', this.location['latitude']);
        data['formData'].append('longitude', this.location['longitude']);
        break;
    }
    data['formData'].append('isAnonymous', (this.isAnonymous).toString());
    data['formData'].append('type', this.locationType);
    data['formData'].append('relationId', this.relationId);

    this.testimonyService.createNewTestimony(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
        this, this.killDialog();
      },
      next: (reply: any) => {
        this.postURL = this.url + '/' + reply['_id'];
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => {
        this.stepNext();
        this.submitted = false;
        this.addTestimonyFormGroup.reset();
      }
    });
  }
}
