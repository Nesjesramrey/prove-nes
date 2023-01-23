import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.single-testimony-dialog',
  templateUrl: './single-testimony-dialog.component.html',
  styleUrls: ['./single-testimony-dialog.component.scss']
})
export class SingleTestimonyDialogComponent implements OnInit {
  public testimony: any = null;

  constructor(
    public dialogRef: MatDialogRef<SingleTestimonyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    // console.log(this.dialogData);
    this.testimony = this.dialogData['testimony'];
    console.log(this.testimony);
  }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
