import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.description-viewer-dialog',
  templateUrl: './description-viewer.component.html',
  styleUrls: ['./description-viewer.component.scss']
})
export class DescriptionViewerComponent implements OnInit {
  public text: string = '';
  public title: string = '';

  constructor(
    public dialogRef: MatDialogRef<DescriptionViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { text: string; title: string },
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.text = this.dialogData.text;
    this.title = this.dialogData.title;
  }

  killDialog() {
    this.dialogRef.close();
  }
}
