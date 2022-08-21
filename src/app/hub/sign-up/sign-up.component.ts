import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LyDialog } from '@alyle/ui/dialog';

import { EmailValidationDialogComponent } from 'src/app/components/email-validation-dialog/email-validation-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: '.sign-up-page',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpFormGroup!: FormGroup;
  public submitted: boolean = false;
  public hide: boolean = true;
  public user: any = null;

  constructor(
    public formBuilder: FormBuilder,
    public dialog: LyDialog,
    public authenticationSrvc: AuthenticationService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth,
    public angularFireStore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.signUpFormGroup = this.formBuilder.group({
      firstname: ['Alberto', [Validators.required, Validators.minLength(2)]],
      lastname: ['Paredes', [Validators.required, Validators.minLength(2)]],
      email: ['al.paredes@icloud.com', [Validators.required, Validators.pattern(this.utilitySrvc.emailPattern), this.utilitySrvc.emailDomainValidator]],
      password: ['123456789', [Validators.required, Validators.minLength(9)]],
      phone: ['5540639356', [Validators.minLength(10), Validators.maxLength(10)]],
      zipcode: ['53100', [Validators.minLength(5), Validators.maxLength(5)]],
      terms: [true, [Validators.required]],
      privacy: [true, [Validators.required]]
    });
  }

  onSignUp(formGroup: FormGroup) {
    this.submitted = true;

    let email: any = formGroup['value']['email'];
    let password: any = formGroup['value']['password'];

    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then((reply: any) => {
        this.SetUserData(reply['user']);
        this.SendVerificationMail();
        // console.log('reply: ', reply);
        this.user = reply['user']['multiFactor']['user'];
        console.log('user: ', this.user);
        console.log(this.user['accessToken']);

        let signUpData: any = {
          firebaseUID: this.user['uid'],
          firstname: formGroup['value']['firstname'],
          lastname: formGroup['value']['lastname'],
          email: formGroup['value']['email'],
          password: formGroup['value']['password']
        }
        this.authenticationSrvc.signup(signUpData).subscribe((reply: any) => {
          console.log(reply);
        });
      })
      .catch((error: any) => {
        this.submitted = false;
      });


    // this.authenticationSrvc.validateEmail(
    //   { email: formGroup.value.email }
    // ).subscribe((reply: any) => {
    //   this.submitted = false;

    //   if (reply['status'] == false) {
    //     this.utilitySrvc.openErrorSnackBar(reply['error']);
    //     return;
    //   }
    //   this.utilitySrvc.openSuccessSnackBar(reply['message']);
    //   signUpData['validationCode'] = reply['validationCode'];

    //   const dialogRef = this.dialog.open<EmailValidationDialogComponent>(EmailValidationDialogComponent, {
    //     width: 420,
    //     data: {
    //       signUpData: signUpData
    //     },
    //     disableClose: true
    //   });

    //   dialogRef.afterClosed.subscribe((reply: any) => {
    //     if (reply != undefined) { }
    //   });
    // });
  }

  SendVerificationMail() {
    return this.angularFireAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        // this.utilitySrvc.router.navigateByUrl('/');
      });
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
