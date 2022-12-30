import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';;
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

interface Gender {
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
  public happyArray: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;

  genders: Gender[] = [
    { value: 'masculino', viewValue: 'Masculino' },
    { value: 'femenino', viewValue: 'Femenino' },
    { value: 'otro', viewValue: 'Otro' },
  ];
  asociations: Asociation[] = [
    { value: 'ONG', viewValue: 'ONG' },
    { value: 'AC', viewValue: 'Asocación Civil' },
    { value: 'Otra', viewValue: 'Otra' },
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
          gender: ['', [Validators.required]],
          postalcode: ['', [Validators.required]],
          ocupation: ['', [Validators.required]],
          phone: ['', [Validators.required]],
          associationName: [this.user['associationName'], [Validators.required]],
          associationTypology: [this.user['associationTypology'], [Validators.required]],
          associationDescription: [this.user['associationDescription'], [Validators.required]],
          associationInterests: [this.user['associationInterests'], [Validators.required]],
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
      gender: form['value']['gender'],
      postalcode: form['value']['postalcode'],
      ocupation: form['value']['ocupation'],
      phone: form['value']['phone'],
      associationName: form['value']['associationName'],
      associationTypology: form['value']['associationTypology'],
      associationDescription: form['value']['associationDescription'],
      associationInterests: form['value']['associationInterests'],
      
    };
    console.log(data);
  }

  addHappyItem(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.happyArray.push({ name: value });
    }
    event.chipInput!.clear();
  }

  removeHappyItem(item: any) {
    const index = this.happyArray.indexOf(item);
    if (index >= 0) {
      this.happyArray.splice(index, 1);
    }
  }
}
