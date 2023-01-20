import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LyDialog } from '@alyle/ui/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SetAvatarDialogComponent } from 'src/app/components/set-avatar-dialog/set-avatar-dialog.component';
import { AssociationRegisterComponent } from '../components/association-register/association-register.component';

interface Gender {
  value: string;
  viewValue: string;
}

@Component({
  selector: '.app-configuration-page',
  templateUrl: './app-configuration.component.html',
  styleUrls: ['./app-configuration.component.scss'],
})
export class AppConfigurationComponent implements OnInit {
  public checked = false;
  public formGroup!: FormGroup;
  public happyArray: any[] = [];
  public unhappyArray: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;

  genders: Gender[] = [
    { value: 'masculino', viewValue: 'Masculino' },
    { value: 'femenino', viewValue: 'Femenino' },
    { value: 'otro', viewValue: 'Otro' },
  ];

  public accessToken: any = null;
  public user: any = null;
  public payload: any = null;
  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  public showText: boolean = false;
  public isLinear: boolean = true;

  constructor(
    public authenticationSrvc: AuthenticationService,
    public utilityService: UtilityService,
    public userService: UserService,
    public deviceDetectorService: DeviceDetectorService,
    public formBuilder: FormBuilder,
    public dialogData: MatDialog,
    public dialog: LyDialog,
    public utilitySrvc: UtilityService,
  ) {
    this.accessToken = this.authenticationSrvc.fetchAccessToken;
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {

    

    this.userService.fetchFireUser().subscribe({
      error: (error) => {
        switch (error['status']) {
        }
      },
      next: (reply: any) => {
        this.user = reply;
        //console.log(this.user);
        this.happyArray = JSON.parse(this.user.associationInterests)
        this.unhappyArray = JSON.parse(this.user.uninterestingTopics)
        //console.log(this.user.uninterestingTopics)

       
        this.formGroup = this.formBuilder.group({
          firstname: [this.user['firstname'], [Validators.required]],
          lastname: [this.user['lastname'], [Validators.required]],
          gender: ['', []],
          postalcode: [this.user['zipcode'], []],
          phone: [this.user['phone'], []],
          associationInterests: ['', []],
          uninterestingTopics: ['', []],
        });
      },
      complete: () => {
        this.isDataAvailable = true;
      },
    });
  }

  openCropperDialog(event: Event) {
    const dialogRef = this.dialog.open<SetAvatarDialogComponent, Event>(
      SetAvatarDialogComponent,
      {
        width: 300,
        data: event,
        disableClose: true,
      }
    );
    dialogRef.afterClosed.subscribe((reply: any) => {
      if (reply != undefined) {
        window.location.reload();
      }
    });
  }

  onUpdateUserData(form: FormGroup) {
    let data: any = {
      user_id: this.user._id,
      firstname: form['value']['firstname'],
      lastname: form['value']['lastname'],
      gender: form['value']['gender'],
      zipcode: form['value']['postalcode'],
      ocupation: form['value']['ocupation'],
      phone: form['value']['phone'],
      uninterestingTopics: JSON.stringify(this.unhappyArray) || null,
      associationInterests: JSON.stringify(this.happyArray) || null,
    };
    
    this.userService.updateProfile(data).subscribe({
      error: (error) => {
        switch (error['status']) {
        }
      },
      next: (reply: any) => {
        //console.log(data);
      },
      complete: () => {
        window.location.reload();
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

  openDialogAssociationRegister() {
      this.dialogData.open(AssociationRegisterComponent, {
      data: {},
      height: '100%',
      maxWidth: '100%',
      panelClass: 'full-dialog',
    });
    this.checked = !this.checked
  }

  clearForm() {
    //this.formGroup.reset();
    this.formGroup.controls['gender'].reset();
  }

  clearInputUnhappy(){
    this.unhappyArray = [];
  }

  clearInputHappy(){
    this.happyArray = [];
  }


}
