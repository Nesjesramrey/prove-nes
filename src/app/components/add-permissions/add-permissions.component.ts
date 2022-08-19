import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-permissions-dialog',
  templateUrl: './add-permissions.component.html',
  styleUrls: ['./add-permissions.component.scss']
})
export class AddPermissionsComponent implements OnInit {
  public permissionsFormControl = new FormControl([], [Validators.required]);
  public permissionList = [
    { value: 'moderator', viewValue: 'Moderador' },
    { value: 'administrator', viewValue: 'Administrador' },
    { value: 'support', viewValue: 'Soporte' },
  ];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public userSrvc: UserService,
    public utilitySrvc: UtilityService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.permissionsFormControl.setValue(this.dialogData['user'][0]['activities']);
  }

  onAddPermissions(action: string) {
    let data: any;

    switch (action) {
      case 'add':
        data = {
          userID: this.dialogData['userID'],
          activities: this.permissionsFormControl['value']
        }
        break;

      case 'remove':
        data = {
          userID: this.dialogData['userID'],
          activities: []
        }
        break;
    }

    this.userSrvc.addUserPermissions(data).subscribe((reply: any) => {
      if (reply['status'] == false) {
        this.utilitySrvc.openErrorSnackBar(reply['error']);
        return;
      }

      this.utilitySrvc.openSuccessSnackBar(reply['message']);
      this.dialogRef.close(reply);
    });
  }

  compareWithFn(opt1: any, opt2: any) {
    return opt1.value === opt2.value;
  }

  killDialog() {
    this.dialogRef.close();
  }
}
