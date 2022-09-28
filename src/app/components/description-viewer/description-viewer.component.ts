import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.description-viewer-dialog',
  templateUrl: './description-viewer.component.html',
  styleUrls: ['./description-viewer.component.scss']
})
export class DescriptionViewerComponent implements OnInit {
  public isDataAvailable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DescriptionViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }
}
