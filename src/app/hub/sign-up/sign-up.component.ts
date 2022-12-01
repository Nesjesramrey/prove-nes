import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LyDialog } from '@alyle/ui/dialog';

import { EmailValidationDialogComponent } from 'src/app/components/email-validation-dialog/email-validation-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '.sign-up-page',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public signUpFormGroup!: FormGroup;
  public submitted: boolean = false;
  public hide: boolean = true;
  public user: any = null;
  public document: any = null;

  constructor(
    public formBuilder: FormBuilder,
    public dialog: LyDialog,
    public authenticationSrvc: AuthenticationService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth,
    public angularFireStore: AngularFirestore,
    public router: Router,
    public documentService: DocumentService,
    public UserService: UserService
  ) { }

  ngOnInit(): void {
    this.signUpFormGroup = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utilitySrvc.emailPattern),
          this.utilitySrvc.emailDomainValidator,
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(9)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      zipcode: ['', [Validators.minLength(5), Validators.maxLength(5)]],
      terms: [true, [Validators.required]],
      privacy: [true, [Validators.required]],
    });

    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.document = reply;
      },
    });
  }

  /**
   * @see https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword
   */
  onSignUp(formGroup: FormGroup) {
    this.submitted = true;

    let firstname = formGroup['value']['firstname'];
    let lastname = formGroup['value']['lastname'];
    firstname = this.utilitySrvc.capitalizeFirstLetter(firstname);
    lastname = this.utilitySrvc.capitalizeFirstLetter(lastname);
    let email: any = formGroup['value']['email'].toLowerCase();
    let password: any = formGroup['value']['password'];

    this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((reply: any) => {
      this.SetUserData(reply['user']);
      this.SendVerificationMail();
      this.user = reply['user']['multiFactor']['user'];

      let signUpData = new FormData();
      signUpData.append('firebaseUID', this.user['uid']);
      signUpData.append('firstname', formGroup['value']['firstname']);
      signUpData.append('lastname', formGroup['value']['lastname']);
      signUpData.append('email', formGroup['value']['email']);
      signUpData.append('password', formGroup['value']['password']);

      this.authenticationSrvc.signup(signUpData).subscribe((reply: any) => {
        localStorage.setItem('accessToken', this.user['accessToken']);
        this.router.navigate(['/documentos-publicos/' + this.document['_id']], { state: { status: 'reload' } });

        // this.angularFireAuth.signInWithEmailAndPassword(
        //   formGroup['value']['email'], formGroup['value']['password']
        // ).then((reply: any) => {
        //   this.angularFireAuth.authState.subscribe((data: any) => {
        //     this.submitted = false;
        //     localStorage.setItem('accessToken', data['multiFactor']['user']['accessToken']);
        //     this.router.navigate(['/documentos-publicos/' + this.document['_id']], { state: { status: 'reload' } });
        //     this.UserService.onLogin.next(signUpData);
        //   });
        // });
      });
      // this.utilitySrvc.openSuccessSnackBar('El registro fue exitoso');
    })
      .catch((error: any) => {
        switch (error['code']) {
          case 'auth/email-already-in-use':
            this.utilitySrvc.openErrorSnackBar('El correo electrónico ya esta en uso.');
            break;
        }

        // "auth/email-already-in-use":
        // "auth/invalid-email": 
        // "auth/operation-not-allowed":         
        // "auth/weak-password": 
        // "auth/network-request-failed":  

        this.submitted = false;
      });
  }

  SendVerificationMail() {
    return this.angularFireAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
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
