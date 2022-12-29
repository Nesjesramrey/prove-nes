import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';;
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

interface Genre {
  value: string;
  viewValue: string;
}

interface Asociation {
  value: string;
  viewValue: string;
}

@Component({
  selector: '.app-configuration-page',
  templateUrl: './app-configuration.component.html',
  styleUrls: ['./app-configuration.component.scss'],
})
export class AppConfigurationComponent implements OnInit {
  public formGroup!: FormGroup;

  genres: Genre[] = [
    { value: 'male-0', viewValue: 'Masculino' },
    { value: 'female-1', viewValue: 'Femenino' },
    { value: 'other-2', viewValue: 'Otro' },
  ];
  asociations: Asociation[] = [
    { value: 'ong-0', viewValue: 'ONG' },
    { value: 'ac-1', viewValue: 'Asocación Civil' },
    { value: 'other-2', viewValue: 'Otra' },
  ];

  public accessToken: any = null;
  public user: any = null;
  public payload: any = null;
  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  public showText: boolean = false;
  public isLinear: boolean = true

  constructor(
    public authenticationSrvc: AuthenticationService,
    public utilityService: UtilityService,
    public userService: UserService,
    public deviceDetectorService: DeviceDetectorService,
    public formBuilder: FormBuilder
  ) {
    this.accessToken = this.authenticationSrvc.fetchAccessToken;
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
    this.userService.fetchFireUser().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.user = reply;
        console.log(this.user);

        this.formGroup = this.formBuilder.group({
          firstname: [this.user['firstname'], [Validators.required]],
          lastname: [this.user['lastname'], [Validators.required]],
          email: ['', [Validators.required]]
        });
      },
      complete: () => {
        this.isDataAvailable = true;
      },
    });
  }

  onUpdateUserData(form: FormGroup) {
    let data: any = {
      firstname: form['value']['firstname'],
      lastname: form['value']['lastname'],
      email: form['value']['email']
    };
    console.log(data);
  }
}
