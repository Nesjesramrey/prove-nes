import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.marathon-info-dialog',
  templateUrl: './marathon-info-dialog.component.html',
  styleUrls: ['./marathon-info-dialog.component.scss']
})
export class MarathonInfoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MarathonInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void { }

  killDialog() { this.dialogRef.close(); }
}
