import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.quick-login-dialog',
  templateUrl: './quick-login-dialog.component.html',
  styleUrls: ['./quick-login-dialog.component.scss']
})
export class QuickLoginDialogComponent implements OnInit {
  public loginFG!: FormGroup;
  public submitted: boolean = false;
  public hide: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<QuickLoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public angularFireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.loginFG = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
      password: ['', [Validators.required]]
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  onLogin(form: FormGroup) {
    this.submitted = true;

    this.angularFireAuth.signInWithEmailAndPassword(
      form['value']['email'], form['value']['password']).then((reply: any) => {
        this.angularFireAuth.authState.subscribe((data: any) => {
          this.submitted = false;
          localStorage.setItem('accessToken', data['multiFactor']['user']['accessToken']);
          window.location.reload();
        });
      }).catch((error: any) => {
        this.submitted = false;
        switch (error['code']) {
          case 'auth/wrong-password':
            this.utilityService.openErrorSnackBar('Tu contraseña es incorrecta.');
            break;
          case 'auth/user-not-found':
            this.utilityService.openErrorSnackBar('No se encontro el usuario.');
            break;
        }
      });
  }
}
