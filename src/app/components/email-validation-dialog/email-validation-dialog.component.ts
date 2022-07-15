import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.email-validation-dialog',
  templateUrl: './email-validation-dialog.component.html',
  styleUrls: ['./email-validation-dialog.component.scss']
})
export class EmailValidationDialogComponent implements OnInit {
  public emailValidationFormGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: LyDialogRef,
    @Inject(LY_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public authenticationSrvc: AuthenticationService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.emailValidationFormGroup = this.formBuilder.group({
      step_1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      step_2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      step_3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      step_4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]]
    });
  }

  onValidateEmail(formGroup: FormGroup) {
    let validationCode: any = formGroup.value.step_1 + formGroup.value.step_2 + formGroup.value.step_3 + formGroup.value.step_4;
    this.submitted = true;

    if (validationCode == this.dialogData['signUpData']['validationCode']) {
      let email: any = this.dialogData['signUpData']['email'];
      let password: any = this.dialogData['signUpData']['password'];

      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
        .then((result: any) => {
          this.dialogData['signUpData']['firebaseID'] = result['user']['uid'];
          this.authenticationSrvc.signup(this.dialogData['signUpData']).subscribe((reply: any) => {
            this.submitted = false;
            if (reply['status'] == false) {
              this.utilitySrvc.openErrorSnackBar(reply['error']);
              this.dialogRef.close();
              return;
            }
            this.dialogRef.close(reply);
            localStorage.setItem('token', reply['token']);
            window.location.reload();
          });
        })
        .catch((error: any) => {
          this.submitted = false;
        });
    } else {
      console.log('error');
    }
  }

  sendCode() { }

  killDialog() {
    this.dialogRef.close();
  }
}
