import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.add-comments-dialog',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.scss']
})
export class AddCommentsComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public commentFormGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.commentFormGroup = this.formBuilder.group({
        comment: ['', [Validators.required]]
      });

      this.isDataAvailable = true;
    }, 1000);
  }

  onComment(formGroup: FormGroup) {
    this.submitted = true;

    let data: any = {
      comment: formGroup['value']['comment']
    };
    console.log(data);
  }

  killDialog() {
    this.dialogRef.close();
  }
}
