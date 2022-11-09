import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.sign-in-mobile',
  templateUrl: './sign-in-mobile.component.html',
  styleUrls: ['./sign-in-mobile.component.scss']
})
export class SignInMobileComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public signInFormGroup!: FormGroup;
  public submitted: boolean = false;
  public hide: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public angularFireAuth: AngularFireAuth,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.signInFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  onSignIn(form: FormGroup) {
    this.submitted = true;

    this.angularFireAuth.signInWithEmailAndPassword(form['value']['email'], form['value']['password'])
      .then((reply: any) => {
        this.angularFireAuth.authState.subscribe((data: any) => {
          this.submitted = false;
          localStorage.setItem('accessToken', data['multiFactor']['user']['accessToken']);
          this.router.navigateByUrl('/', { state: { status: 'logout' } });
        });
      })
      .catch((error: any) => {
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
