import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.sign-in-page',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  public signInFormGroup!: FormGroup;
  public submitted: boolean = false;
  public hide: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public authenticationSrvc: AuthenticationService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.signInFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilitySrvc.emailPattern), this.utilitySrvc.emailDomainValidator]],
      password: ['', [Validators.required, Validators.minLength(9)]]
    });
  }

  onSignIn(form: FormGroup) {
    this.submitted = true;

    this.angularFireAuth.signInWithEmailAndPassword(form['value']['email'], form['value']['password'])
      .then((reply: any) => {
        // console.log(reply);
        this.angularFireAuth.authState.subscribe((data: any) => {
          // console.log(data['multiFactor']['user']);
          this.submitted = false;
          localStorage.setItem('accessToken', data['multiFactor']['user']['accessToken']);
          // localStorage.setItem('uid', data['multiFactor']['user']['uid']);
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error['code']);
        this.submitted = false;

        // switch (error['code']) {
        //   case 'auth/wrong-password':
        //     this.utilitySrvc.openErrorSnackBar('Tu contraseña es incorrecta.');
        //     break;

        //   case 'auth/user-not-found':
        //     this.utilitySrvc.openErrorSnackBar('No se encontro el usuario.');
        //     break;
        // }
      });

    // let data: any = {
    //   email: form.value.email,
    //   password: form.value.password
    // }

    // this.authenticationSrvc.signin(data).subscribe((reply: any) => {
    //   this.submitted = false;

    //   if (reply['status'] == false) {
    //     this.utilitySrvc.openErrorSnackBar(reply['error']);
    //     return;
    //   }

    //   localStorage.setItem('token', reply['token']);
    //   window.location.reload();
    // });
  }
}
