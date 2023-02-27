import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.use-tools-dialog',
  templateUrl: './use-tools-dialog.component.html',
  styleUrls: ['./use-tools-dialog.component.scss']
})
export class UseToolsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UseToolsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
