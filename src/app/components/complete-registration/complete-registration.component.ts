import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

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

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public userService: UserService
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
      zipcode: ['', []]
    });

    this.stepThreeFormGroup = this.formBuilder.group({
      type: ['', []],
      organizationName: ['', []]
    });
  }

  onCompleteRegistration() {
    let data: any = {
      userID: this.user['_id'],
      firstname: this.stepOneFormGroup.value['firstname'],
      lastname: this.stepOneFormGroup.value['lastname'],
      isFullRegister: true
    };

    this.userService.addUserPermissions(data).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.dialogRef.close();
        window.location.reload();
      },
      complete: () => { }
    });
  }
}
