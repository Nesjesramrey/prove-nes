import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LyDialog } from '@alyle/ui/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatStepper } from '@angular/material/stepper';
import { SetAvatarDialogComponent } from 'src/app/components/set-avatar-dialog/set-avatar-dialog.component';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface Fruit {
  name: string;
}

@Component({
  selector: '.sign-up-mobile',
  templateUrl: './sign-up-mobile.component.html',
  styleUrls: ['./sign-up-mobile.component.scss']
})
export class SignUpMobileComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public submitted: boolean = false;
  public signupFormGroup!: FormGroup;
  public associationTypologyArray: any = [];
  public file: any = null;
  public fruits: Fruit[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;

  public stepOneFormGroup!: FormGroup;
  public stepTwoFormGroup!: FormGroup;
  public stepThreeFormGroup!: FormGroup;
  public document: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  @ViewChild('stepper') public stepper!: MatStepper;
  public viewSubLayouts: boolean = false;
  public bagOfWords: any = ['Educación', 'Cultura', 'Política', 'Empleo', 'Arte', 'Delincuencia', 'Violencia', 'Salud'];

  constructor(
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public dialog: LyDialog,
    public utilityService: UtilityService,
    public angularFireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.signupFormGroup = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      alias: ['', []],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: ['', []],
      associationTypology: ['', []],
      associationName: ['', []],
      associationDescription: ['', []],
      associationInterests: ['', []]
    });

    this.utilityService.fetchAssociationTypology().subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.associationTypologyArray = reply;
      },
      complete: () => { }
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);

    this.stepOneFormGroup = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => {
        setTimeout(() => {
          this.isDataAvailable = true;
        }, 100);
      },
      next: (reply: any) => {
        this.document = reply;
        this.layouts = this.document['layouts'];
        this.sublayouts = this.layouts[0]['subLayouts'];
      },
      complete: () => { }
    });
  }

  dragAndDropLayout(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layouts, event.previousIndex, event.currentIndex);
  }

  dragAndDropSubLayout(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sublayouts, event.previousIndex, event.currentIndex);
  }

  onLayoutSelected(layout: any) {
    this.viewSubLayouts = true;
    this.sublayouts = layout['subLayouts'];
  }

  hideSubLayouts() {
    this.viewSubLayouts = false;
  }

  openCropperDialog(event: Event) {
    const dialogRef = this.dialog.open<SetAvatarDialogComponent, Event>(SetAvatarDialogComponent, {
      width: 420,
      data: event,
      disableClose: true
    });

    dialogRef.afterClosed.subscribe((reply: any) => {
      if (reply != undefined) {
        this.file = reply['file'];
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.fruits.push({ name: value });
    }
    event.chipInput!.clear();
    this.signupFormGroup.patchValue({ associationInterests: this.fruits });
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  onRegister(form: FormGroup) {
    this.submitted = true;
    let email: any = form['value']['email'];
    let password: any = form['value']['password'];

    return;


    let data = new FormData();
    if (this.file != null) { data.append('file', this.file, 'avatar.jpg'); }
    data.append('firstname', form['value']['firstname']);
    data.append('lastname', form['value']['lastname']);
    data.append('alias', form['value']['alias']);
    data.append('email', form['value']['email']);
    data.append('password', form['value']['password']);
    data.append('phone', form['value']['phone']);
    data.append('associationTypology', form['value']['associationTypology']);
    data.append('associationName', form['value']['associationName']);
    data.append('associationDescription', form['value']['associationDescription']);
    data.append('associationInterests', JSON.stringify(form['value']['associationInterests']));
  }
}
