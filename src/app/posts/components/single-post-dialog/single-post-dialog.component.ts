import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.single-post-dialog',
  templateUrl: './single-post-dialog.component.html',
  styleUrls: ['./single-post-dialog.component.scss']
})
export class SinglePostDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SinglePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void { }
}
