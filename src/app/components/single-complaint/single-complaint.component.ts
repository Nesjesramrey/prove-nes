import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.single-complaint',
  templateUrl: './single-complaint.component.html',
  styleUrls: ['./single-complaint.component.scss']
})
export class SingleComplaintComponent implements OnInit {
  public complaint: any = null;

  constructor(
    public dialogRef: MatDialogRef<SingleComplaintComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    // console.log(this.dialogData);
    this.complaint = this.dialogData['complaint'];
    console.log(this.complaint);
  }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
