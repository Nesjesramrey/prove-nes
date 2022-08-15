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
      email: ['al.paredes@icloud.com', [Validators.required, Validators.pattern(this.utilitySrvc.emailPattern), this.utilitySrvc.emailDomainValidator]],
      password: ['KxElxnWsjsa74', [Validators.required, Validators.minLength(9)]]
    });
  }

  onSignIn(form: FormGroup) {
    this.submitted = true;

    let data: any = {
      email: form.value.email,
      password: form.value.password
    }

    this.angularFireAuth.signInWithEmailAndPassword(form['value']['email'], form['value']['password'])
      .then((result) => {
        // console.log(result['user']);
        this.angularFireAuth.authState.subscribe((user) => {
          console.log(user);
        });
      })
      .catch((error) => {
        console.log(error['code']);

        switch (error['code']) {
          case 'auth/wrong-password':
            break;

          case 'auth/user-not-found':
            break
        }
      });

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
