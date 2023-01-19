import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.single-complaint-dialog',
  templateUrl: './single-complaint-dialog.component.html',
  styleUrls: ['./single-complaint-dialog.component.scss']
})
export class SingleComplaintDialogComponent implements OnInit {
  public complaint: any = null;

  constructor(
    public dialogRef: MatDialogRef<SingleComplaintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    // console.log(this.dialogData);
    this.complaint = this.dialogData['complaint'];
    // console.log(this.complaint);
  }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
