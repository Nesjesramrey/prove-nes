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
  public formGroup!: FormGroup;
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
    this.formGroup = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]]
    });
  }

  onCompleteRegistration(form: FormGroup) {
    let data: any = {
      userID: this.user['_id'],
      firstname: form['value']['firstname'],
      lastname: form['value']['lastname'],
      isFullRegister: true
    };
    this.userService.addUserPermissions(data).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.dialogRef.close();
        window.location.reload();
      },
      complete: () => { }
    });
  }
}
