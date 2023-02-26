import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss']
})
export class UserDetailsDialogComponent implements OnInit {
  public user: any = null;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    console.log(this.dialogData);
    this.user = this.dialogData['user'];
  }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
