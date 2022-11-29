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
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from 'src/app/services/user.service';

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
  public associationTypologyArray: any[] = [];
  public file: any = null;
  public fruits: Fruit[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;
  public hide: boolean = true;
  public user: any = null;

  public stepOneFormGroup!: FormGroup;
  public stepTwoFormGroup!: FormGroup;
  public stepThreeFormGroup!: FormGroup;
  public legalsFormGroup!: FormGroup;
  public document: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  @ViewChild('stepper') public stepper!: MatStepper;
  public viewSubLayouts: boolean = false;
  public bagOfWords: any = ['Educación', 'Cultura', 'Política', 'Empleo', 'Arte', 'Delincuencia', 'Violencia', 'Salud'];
  public happyArray: any[] = [];
  public sadArray: any[] = [];
  public layoutsCategoryPreference: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public dialog: LyDialog,
    public utilityService: UtilityService,
    public angularFireAuth: AngularFireAuth,
    public router: Router,
    public authenticationSrvc: AuthenticationService,
    public angularFireStore: AngularFirestore,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.signupFormGroup = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      // alias: ['', []],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: ['', []],
      // associationTypology: ['', []],
      // associationName: ['', []],
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
    }, 400);

    this.stepOneFormGroup = this.formBuilder.group({
      firstname: ['Jorge', [Validators.required, Validators.minLength(2)]],
      lastname: ['Paredes', [Validators.required, Validators.minLength(2)]],
      email: ['jalpate@outlook.es', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
      password: ['KxElxnWsjsa77', [Validators.required, Validators.minLength(9)]],
      // associationTypology: ['', [Validators.required]],
      // associationName: [null, []]
    });
    // this.stepOneFormGroup.get('associationName')?.disable();

    this.legalsFormGroup = this.formBuilder.group({
      terms: [true, [Validators.required]],
      privacy: [true, [Validators.required]]
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
        this.layouts.filter((x: any, i: any) => {
          let obj: any = {
            priority: i,
            category: x['category']['_id']
          }
          this.layoutsCategoryPreference.push(obj);
        });
      },
      complete: () => { }
    });

  }

  dragAndDropLayout(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layouts, event.previousIndex, event.currentIndex);
    this.layoutsCategoryPreference = [];
    this.layouts.filter((x: any, i: any) => {
      let obj: any = {
        priority: i,
        category: x['category']['_id']
      }
      this.layoutsCategoryPreference.push(obj);
    });
    // console.log(this.layoutsCategoryPreference);
  }

  dragAndDropSubLayout(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sublayouts, event.previousIndex, event.currentIndex);
  }

  onLayoutSelected(layout: any) {
    // this.viewSubLayouts = true;
    // this.sublayouts = layout['subLayouts'];
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

  onTypeSelected(event: any) {
    if (event['value']['name'] == 'OSC') {
      this.stepOneFormGroup.get('associationName')?.enable();
      this.stepOneFormGroup.get('associationName')?.setValidators([Validators.required]);
    } else {
      this.stepOneFormGroup.get('associationName')?.disable();
      this.stepOneFormGroup.get('associationName')?.setValidators([]);
      this.stepOneFormGroup['controls']['associationName'].setValue(null);
    }
  }

  addHappyItem(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.happyArray.push({ name: value });
    }
    event.chipInput!.clear();
  }

  removeHappyItem(item: any) {
    const index = this.happyArray.indexOf(item);
    if (index >= 0) {
      this.happyArray.splice(index, 1);
    }
  }

  addSadItem(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.sadArray.push({ name: value });
    }
    event.chipInput!.clear();
  }

  removeSadItem(item: any) {
    const index = this.sadArray.indexOf(item);
    if (index >= 0) {
      this.sadArray.splice(index, 1);
    }
  }

  onRegister() {
    this.submitted = true;

    let firstname = this.stepOneFormGroup['value']['firstname'];
    let lastname = this.stepOneFormGroup['value']['lastname'];
    firstname = this.utilityService.capitalizeFirstLetter(firstname);
    lastname = this.utilityService.capitalizeFirstLetter(lastname);
    let email: any = this.stepOneFormGroup['value']['email'].toLowerCase();
    let password: any = this.stepOneFormGroup['value']['password'];

    this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((reply: any) => {
      this.SetUserData(reply['user']);
      this.SendVerificationMail();
      this.user = reply['user']['multiFactor']['user'];

      let signUpData = new FormData();
      signUpData.append('firebaseUID', this.user['uid']);
      signUpData.append('firstname', this.stepOneFormGroup['value']['firstname']);
      signUpData.append('lastname', this.stepOneFormGroup['value']['lastname']);
      signUpData.append('email', this.stepOneFormGroup['value']['email']);
      signUpData.append('password', this.stepOneFormGroup['value']['password']);
      signUpData.append('associationInterests', JSON.stringify(this.happyArray));
      signUpData.append('uninterestingTopics', JSON.stringify(this.sadArray));

      // this.authenticationSrvc.signup(signUpData).subscribe((reply: any) => {
      //   localStorage.setItem('accessToken', this.user['accessToken']);
      //   this.router.navigateByUrl('/documentos-publicos/' + this.document['_id'], { state: { status: 'logout' } });
      // });
      this.authenticationSrvc.signup(signUpData).subscribe({
        error: (error: any) => {
          this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        },
        next: (reply: any) => {
          this.userService.saveLayoutsCategoryPreference({
            user_id: reply['_id'],
            layoutsCategoryPreference: this.layoutsCategoryPreference
          }).subscribe((reply: any) => { });
        },
        complete: () => {
          localStorage.setItem('accessToken', this.user['accessToken']);
          this.router.navigateByUrl('/documentos-publicos/' + this.document['_id'], { state: { status: 'logout' } });
        }
      });
    }).catch((error: any) => {
      switch (error['code']) {
        case 'auth/email-already-in-use':
          this.utilityService.openErrorSnackBar('El correo electrónico ya esta en uso.');
          break;
      }
      this.submitted = false;
    });
  }

  SendVerificationMail() {
    return this.angularFireAuth.currentUser.then((u: any) => u.sendEmailVerification())
      .then(() => { });
  }

  SetUserData(user: any) {
    const userRef: any = this.angularFireStore.doc(`users/${user.uid}`);
    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}
