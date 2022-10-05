import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';

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
    public formBuilder: FormBuilder,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.commentFormGroup = this.formBuilder.group({
      comment: ['', [Validators.required]],
      file: ['', []]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  onFileSelected(event: any) {
    this.validateSize(event.target);
  }

  validateSize(input: any) {
    const fileSize = input.files[0].size / 1024 / 1024;
    if (fileSize > 1) {
      this.utilityService.openErrorSnackBar('File size exceeds 1 MiB');
    } else {
      this.commentFormGroup.patchValue({ file: input.files[0] });
      this.commentFormGroup.updateValueAndValidity();
    }
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
