import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility.service';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent implements OnInit {
  public formPassword!: FormGroup;
  public submitted: boolean = false;
  public hide: boolean = true;

  constructor(
    public angularFireAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public utilitySrvc: UtilityService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.formPassword = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utilitySrvc.emailPattern),
          this.utilitySrvc.emailDomainValidator,
        ],
      ],
    });
  }

  changePassword(form: FormGroup) {
    let user: Observable<any> = this.userService.passwordRecovery({
      email: form['value']['email'],
    });

    user.subscribe((response) => {
      this.utilitySrvc.openSuccessSnackBar(
        'Se envio la contraseña al correo electronico.'
      );
    });
  }
}
