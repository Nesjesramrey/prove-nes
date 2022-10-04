import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

export interface Fruit {
  name: string;
}

@Component({
  selector: '.complete-registration-dialog',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  public stepOneFormGroup!: FormGroup;
  public stepTwoFormGroup!: FormGroup;
  public stepThreeFormGroup!: FormGroup;
  public user: any = null;
  public genderOptions: any = ['Masculino', 'Femenino', 'Otro'];
  public addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public fruits: Fruit[] = [];
  public associationTypology: any = []

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.user = this.dialogData['user'];
  }

  ngOnInit(): void {
    this.stepOneFormGroup = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]]
    });

    this.stepTwoFormGroup = this.formBuilder.group({
      phone: ['', []],
      zipcode: ['', []],
      gender: ['', []]
    });

    this.stepThreeFormGroup = this.formBuilder.group({
      type: ['', []],
      organizationName: ['', []],
      interests: ['', []]
    });

    this.utilityService.fetchAssociationTypology().subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.dialogRef.close();
      },
      next: (reply: any) => {
        this.associationTypology = reply;
      },
      complete: () => { }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.fruits.push({ name: value });
    }
    event.chipInput!.clear();
    this.stepThreeFormGroup.patchValue({ interests: this.fruits });
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  onCompleteRegistration() {
    let data: any = {
      userID: this.user['_id'],
      firstname: this.stepOneFormGroup['value']['firstname'],
      lastname: this.stepOneFormGroup['value']['lastname'],
      phone: this.stepTwoFormGroup['value']['phone'] || null,
      zipcode: this.stepTwoFormGroup['value']['zipcode'] || null,
      gender: this.stepTwoFormGroup['value']['gender'] || null,
      associationTypology: this.stepThreeFormGroup['value']['type'] || null,
      associationName: this.stepThreeFormGroup['value']['organizationName'] || null,
      associationInterests: this.stepThreeFormGroup['value']['interests'] || null,
      isFullRegister: true
    };

    this.userService.addUserPermissions(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.dialogRef.close();
        window.location.reload();
      },
      complete: () => { }
    });
  }
}
