import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.select-college-dialog',
  templateUrl: './select-college-dialog.component.html',
  styleUrls: ['./select-college-dialog.component.scss']
})
export class SelectCollegeDialogComponent implements OnInit {
  public universities: any = null;

  constructor(
    public dialogRef: MatDialogRef<SelectCollegeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    // console.log(this.dialogData);
    this.universities = this.dialogData['universities'];
  }

  ngOnInit(): void { }
}
