import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.recover-password-dialog',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RecoverPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public userService: UserService
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]]
    });
  }

  recoverPassword(formGroup: FormGroup) {
    this.submitted = true;
    let user: Observable<any> = this.userService.passwordRecovery({
      email: formGroup['value']['email'],
    });
    // user.subscribe((reply: any) => {
    //   this.utilityService.openSuccessSnackBar('Se envio la contraseña al correo electronico.');
    // });
    user.subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar('Se ha envíado un correo electrónico para recuperar tu contraseña.');
      },
      complete: () => {
        this.killDialog();
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
