import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.testimonial-single-view',
  templateUrl: './testimonial-single-view.component.html',
  styleUrls: ['./testimonial-single-view.component.scss']
})
export class TestimonialSingleViewComponent implements OnInit {
  public testimony: any = null;

  constructor(
    public dialogRef: MatDialogRef<TestimonialSingleViewComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    // console.log(this.dialogData);
    this.testimony = this.dialogData['testimony'];
    // console.log(this.testimony['images']);
  }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
