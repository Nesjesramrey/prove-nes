import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, forkJoin } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '.user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss']
})
export class UserDetailsDialogComponent implements OnInit {
  public user: any = null;
  public isDataAvailable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public userService: UserService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchUserById({ _id: this.dialogData['user'] });
    forkJoin([user]).subscribe((reply: any) => {
      // console.log(reply);
      this.user = reply[0];
      this.user['activityName'] = this.user['activities'][0]['viewValue'];

      if (Object.keys(this.user['acl']).length != 0) {
        let layouts: any = this.user['acl']['layouts'].filter((x: any) => { return x['states'].length != 0; });
        this.user['availableLayouts'] = layouts;
      }

      this.isDataAvailable = true;
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
