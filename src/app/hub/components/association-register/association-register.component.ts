import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';;
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { AssociationService } from 'src/app/services/association.service';
import { UtilityService } from 'src/app/services/utility.service';
import { SearchService } from 'src/app/services/search.service';
import { MatStepper } from '@angular/material/stepper';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';



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
  public submitted: boolean = false;
  public searchFormGroup!: FormGroup;
  public dataAssociationFormGroup!: FormGroup;
  public dataComercialFormGroup!: FormGroup;
  public legalsFormGroup!: FormGroup;
  public happyArray: any[] = [];
  public unhappyArray: any[] = [];
  @ViewChild('stepper') public stepper!: MatStepper;
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
  public states: any = [];
  public payload: any = null;
  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  public showText: boolean = false;
  public isLinear: boolean = true;
  @Output () public checked: boolean = true
  public isAssociationAvailable: boolean = false;
  public isNotAssociationAvailable: boolean = false;
  public dataAssociation: any = []

  constructor(
    public authenticationSrvc: AuthenticationService,
    public utilityService: UtilityService,
    public userService: UserService,
    public associationService: AssociationService,
    public deviceDetectorService: DeviceDetectorService,
    public searchService: SearchService,
    public formBuilder: FormBuilder,
    public dialogData: MatDialog,
    public dialogRef: MatDialogRef<AssociationRegisterComponent>,
  ) {
    this.accessToken = this.authenticationSrvc.fetchAccessToken;
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
    let states: Observable<any> = this.utilityService.fetchAllStates();

    forkJoin([states,]).subscribe((reply: any) => {
      // console.log(reply);
      this.states = reply[0];
      let national = this.states.filter((state: any) => { return state['code'] == 'NAL'; });
      this.states = this.states.filter((state: any) => { return state['code'] != 'NAL'; });
      this.states.unshift(national[0]);
    });
  

    this.searchFormGroup = this.formBuilder.group({
      search: ['', [Validators.required]],
    });

    this.userService.fetchFireUser().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.user = reply;
        //console.log(this.user);

        this.dataAssociationFormGroup = this.formBuilder.group({
          associationTypology: ["", [Validators.required]],
          associationName: ["", [Validators.required]],
          associationDescription: ["", [Validators.required]],
         
        });
        this.dataComercialFormGroup = this.formBuilder.group({
        
          associationNameComercial: ["", [Validators.required]],
          associationStreet: ["", [Validators.required]],
          associationNumExt: ["", [Validators.required]],
          associationNumInt: ["", []],
          associationTown: ["", [Validators.required]],
          associationZipCode: ["", [Validators.required]],
          associationCity: ["", [Validators.required]],
          associationState: ["", [Validators.required]],
          file: ["", ]
      
        });

      },
      complete: () => {
        this.isDataAvailable = true;
      },
    });

    this.legalsFormGroup = this.formBuilder.group({
      terms: [true, [Validators.required]],
      privacy: [true, [Validators.required]]
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
      this.dataComercialFormGroup.patchValue({ file: input.files[0] });
      this.dataComercialFormGroup.updateValueAndValidity();
    }
  }

  onCreateAssociation() {
    console.log('click')
    this.submitted = true;
    let data: any = {
      formData: new FormData(),
         
    };
    data['formData'].append('files', this.dataComercialFormGroup.controls['file']['value']);
    data['formData'].append('name', this.dataAssociationFormGroup['value']['associationName'],)
    data['formData'].append('typology', this.dataAssociationFormGroup['value']['associationTypology']),
    data['formData'].append('description', this.dataAssociationFormGroup['value']['associationDescription']),
    data['formData'].append('businessName', this.dataComercialFormGroup['value']['associationNameComercial']),
    data['formData'].append('street', this.dataComercialFormGroup['value']['associationStreet']),
    data['formData'].append('externalNumber', this.dataComercialFormGroup['value']['associationNumExt']),
    data['formData'].append('internalNumber', this.dataComercialFormGroup['value']['associationNumInt']),
    data['formData'].append('colonia', this.dataComercialFormGroup['value']['associationTown']),
    data['formData'].append('ciudad', this.dataComercialFormGroup['value']['associationCity']),
    data['formData'].append('estado', this.dataComercialFormGroup['value']['associationState']),
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
        this.killDialog()
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
    this.dataComercialFormGroup.reset();
  }

  clearInputUnhappy(){
    this.unhappyArray = [];
  }

  clearInputHappy(){
    this.happyArray = [];
  }


  onSearch(formGroup: FormGroup) {
    let data: any = {
      filter: formGroup['value']['search'],  
    };
    console.log(data['filter']),
    this.associationService.searchAssociation(data['filter']).subscribe({
      error: (error: any) => {
        
      },
      next: (reply: any) => {
        console.log(reply.length)
        if (reply.length == 0){
          this.isNotAssociationAvailable = true
          this.isAssociationAvailable = false
        }
        else{
          this.dataAssociation = reply
          this.isNotAssociationAvailable = false
          this.isAssociationAvailable = true
          console.log(this.dataAssociation[0].name)
        }
      },
      complete: () => { 
              },
    });

  }

  onSelectCoverage(evt: any) {
    let national = this.states.filter((state: any) => { return state['_id'] == evt['value']; });
    // if (evt['value'] == national[0]['_id']) {
    //   this.coverageSelect.options.forEach((item: MatOption) => item.disabled = true);
    // }
  }

}