import { Component, OnInit } from '@angular/core';
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

  constructor(
    public formBuilder: FormBuilder,
    public authenticationSrvc: AuthenticationService,
    public utilitySrvc: UtilityService
  ) { }

  ngOnInit(): void {
    this.signInFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilitySrvc.emailPattern), this.utilitySrvc.emailDomainValidator]],
      password: ['', [Validators.required, Validators.minLength(9)]]
    });
  }

  onSignIn(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      email: form.value.email,
      password: form.value.password
    }
    this.authenticationSrvc.signin(data).subscribe((reply: any) => {
      this.submitted = false;
      if (reply['status'] == false) {
        this.utilitySrvc.openErrorSnackBar(reply['error']);
        return;
      }
      localStorage.setItem('token', reply['token']);
      window.location.reload();
    });
  }
}
