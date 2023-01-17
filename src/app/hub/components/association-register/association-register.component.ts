import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';;
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { AssociationService } from 'src/app/services/association.service';
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
  public isLinear: boolean = true;
  @Output () public checked: boolean = true

  constructor(
    public authenticationSrvc: AuthenticationService,
    public utilityService: UtilityService,
    public userService: UserService,
    public associationService: AssociationService,
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
        //console.log(this.user);

        this.formGroup = this.formBuilder.group({
          associationTypology: ["", [Validators.required]],
          associationName: ["", [Validators.required]],
          associationNameComercial: ["", [Validators.required]],
          associationStreet: ["", [Validators.required]],
          associationNumExt: ["", [Validators.required]],
          associationNumInt: ["", []],
          associationTown: ["", [Validators.required]],
          associationZipCode: ["", [Validators.required]],
          associationCity: ["", [Validators.required]],
          associationState: ["", [Validators.required]],
          associationDescription: ["", [Validators.required]],
          interestsTopic: ["", []],
          uninterestsTopic: ["", []],
          file: ["",[]],
        });
      },
      complete: () => {
        this.isDataAvailable = true;
      },
    });
  }

  onFileSelected(event: any) {
    this.validateSize(event.target);
  }

  validateSize(input: any) {
    const fileSize = input.files[0].size / 1024 / 1024;
    if (fileSize > 3) {
      this.utilityService.openErrorSnackBar('Solo archivos de hasta 3 MB.');
    } else {
      this.formGroup.patchValue({ file: input.files[0] });
      this.formGroup.updateValueAndValidity();
    }
  }

  onCreateAssociation(form: FormGroup) {
    let data: any = {
      formData: new FormData(),
         
    };
    data['formData'].append('files', form.controls['file']['value']);
    data['formData'].append('name', form['value']['associationName'],)
    data['formData'].append('typology', form['value']['associationTypology']),
    data['formData'].append('description', form['value']['associationDescription']),
    data['formData'].append('businessName', form['value']['associationNameComercial']),
    data['formData'].append('street', form['value']['associationStreet']),
    data['formData'].append('externalNumber', form['value']['associationNumExt']),
    data['formData'].append('internalNumber', form['value']['associationNumInt']),
    data['formData'].append('colonia', form['value']['associationTown']),
    data['formData'].append('ciudad', form['value']['associationCity']),
    data['formData'].append('estado', form['value']['associationState']),
    data['formData'].append('interestTopics',  JSON.stringify(this.happyArray) || null),
    data['formData'].append('uninterestTopics', JSON.stringify(this.unhappyArray) || null),      
    console.log(data)
    for (let [key, value] of data['formData']) {
      console.log(`${key}: ${value}`)
    }
    this.associationService.createAssociation(data['formData']).subscribe({
      
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        
      },
      complete: () => {
        //location.reload();
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
  }

  clearForm() {
    //this.formGroup.reset();
    this.formGroup.reset();
  }

  clearInputUnhappy(){
    this.unhappyArray = [];
  }

  clearInputHappy(){
    this.happyArray = [];
  }


}