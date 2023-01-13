import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';;
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';



interface Asociation {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-association-register',
  templateUrl: './association-register.component.html',
  styleUrls: ['./association-register.component.scss']
})
export class AssociationRegisterComponent implements OnInit {
  public formGroup!: FormGroup;
  public happyArray: any[] = [];
  public unhappyArray: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;



  asociations: Asociation[] = [
    { value: '6399e5c7c878ad9b63dde6a2', viewValue: 'Ciudadanía' },
    { value: '6399e5c7c878ad9b63dde6a5', viewValue: 'Activista' },
    { value: '6399e5c7c878ad9b63dde6a4', viewValue: 'OSC' },
    { value: '6399e5c7c878ad9b63dde6a6', viewValue: 'Estudiante' },
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
    public formBuilder: FormBuilder,
    public dialogData: MatDialog,
    public dialogRef: MatDialogRef<AssociationRegisterComponent>,
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
          associationTypology: [this.user['associationTypology'], [Validators.required]],
          associationName: [this.user['associationName'], [Validators.required]],
          associationNameComercial: ["", [Validators.required]],
          associationRFC: ["", [Validators.required]],
          associationStreetAddress: ["", [Validators.required]],
          associationNoExtAddress: ["", [Validators.required]],
          associationTownAddress: ["", [Validators.required]],
          associationZipCodeAddress: ["", [Validators.required]],
          associationCityAddress: ["", [Validators.required]],
          associationEstateAddress: ["", [Validators.required]],
          associationNameContact: ["", [Validators.required]],
          associationPhoneContact: ["", [Validators.required]],
          associationEmailContact: ["", [Validators.required]],
          associationDescription: [this.user['associationDescription'], [Validators.required]],
          associationInterests: ["", [Validators.required]],
          interestsTopic: ["", [Validators.required]],
          uninterestsTopic: ["", [Validators.required]],
        });
      },
      complete: () => {
        this.isDataAvailable = true;
      },
    });
  }

  

  onUpdateUserData(form: FormGroup) {
    let data: any = {
      associationName: form['value']['associationName'],
      associationTypology: form['value']['associationTypology'],
      associationDescription: form['value']['associationDescription'],
      interestsTopic: JSON.stringify(this.happyArray) || null,
      uninterestsTopic: JSON.stringify(this.unhappyArray) || null,          
    };
    this.userService.addAssociation(data).subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        console.log(data)
      },
      complete: () => {
        location.reload();
        this.isDataAvailable = true;
      },
    });
  }

  addHappyItem(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.happyArray.push({ name: value });
      //console.log(this.happyArray)
    }
    event.chipInput!.clear();
 
  }

  removeHappyItem(item: any) {
    const index = this.happyArray.indexOf(item);
    if (index >= 0) {
      this.happyArray.splice(index, 1);
    }
  }

  addUnhappyItem(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.unhappyArray.push({ name: value });
      //console.log(this.happyArray)
    }
    event.chipInput!.clear();
 
  }

  removeUnhappyItem(item: any) {
    const index = this.unhappyArray.indexOf(item);
    if (index >= 0) {
      this.unhappyArray.splice(index, 1);
    }
  }

  killDialog() {
    this.dialogRef.close();
    location.reload()
  }

  clearForm() {
    //this.formGroup.reset();
    this.formGroup.reset();
  }


}