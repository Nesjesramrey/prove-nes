import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LyDialog } from '@alyle/ui/dialog';

import { EmailValidationDialogComponent } from 'src/app/components/email-validation-dialog/email-validation-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.sign-up-page',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpFormGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public dialog: LyDialog,
    public authenticationSrvc: AuthenticationService,
    public utilitySrvc: UtilityService
  ) { }

  ngOnInit(): void {
    this.signUpFormGroup = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: ['', []],
      zipcode: ['', []],
      terms: [true, [Validators.required]],
      privacy: [true, [Validators.required]]
    });
  }

  onSignUp(formGroup: FormGroup) {
    this.submitted = true;

    let signUpData: any = {
      firstname: formGroup.value.firstname,
      lastname: formGroup.value.lastname,
      email: formGroup.value.email,
      password: formGroup.value.password,
      phone: formGroup.value.phone,
      zipcode: formGroup.value.zipcode
    }

    this.authenticationSrvc.validateEmail(
      { email: formGroup.value.email }
    ).subscribe((reply: any) => {
      this.submitted = false;

      if (reply['status'] == false) {
        this.utilitySrvc.openErrorSnackBar(reply['error']);
        return;
      }
      this.utilitySrvc.openSuccessSnackBar(reply['message']);
      signUpData['validationCode'] = reply['validationCode'];

      const dialogRef = this.dialog.open<EmailValidationDialogComponent>(EmailValidationDialogComponent, {
        width: 420,
        data: {
          signUpData: signUpData
        },
        disableClose: true
      });

      dialogRef.afterClosed.subscribe((reply: any) => {
        if (reply != undefined) { }
      });
    });
  }
}
