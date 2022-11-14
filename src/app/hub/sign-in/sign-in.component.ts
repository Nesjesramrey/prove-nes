import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { WelcomeDialogComponent } from 'src/app/components/welcome-dialog/welcome-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.sign-in-page',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public signInFormGroup!: FormGroup;
  public submitted: boolean = false;
  public hide: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public authenticationSrvc: AuthenticationService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['from'] != undefined) {
        this.popGreetingsDialog();
      }
    });
  }

  ngOnInit(): void {
    this.signInFormGroup = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utilitySrvc.emailPattern),
          this.utilitySrvc.emailDomainValidator,
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  popGreetingsDialog() {
    const dialogRef = this.dialog.open<WelcomeDialogComponent>(
      WelcomeDialogComponent,
      {
        width: '420px',
        data: {},
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  onSignIn(form: FormGroup) {
    this.submitted = true;

    this.angularFireAuth
      .signInWithEmailAndPassword(
        form['value']['email'],
        form['value']['password']
      )
      .then((reply: any) => {
        // console.log('reply: ', reply);
        this.angularFireAuth.authState.subscribe((data: any) => {
          // console.log('user: ', data['multiFactor']['user']);
          this.submitted = false;
          localStorage.setItem(
            'accessToken',
            data['multiFactor']['user']['accessToken']
          );
          // window.location.reload();
          // this.utilitySrvc.linkMe('/');
          this.router.navigate(['/'], { state: { status: 'logout' } });
        });
      })
      .catch((error) => {
        // console.log(error['code']);
        this.submitted = false;

        switch (error['code']) {
          case 'auth/wrong-password':
            this.utilitySrvc.openErrorSnackBar('Tu contraseña es incorrecta.');
            break;

          case 'auth/user-not-found':
            this.utilitySrvc.openErrorSnackBar('No se encontro el usuario.');
            break;
        }
      });
  }
}
