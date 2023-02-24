import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.search-posts-dialog',
  templateUrl: './search-posts-dialog.component.html',
  styleUrls: ['./search-posts-dialog.component.scss']
})
export class SearchPostsDialogComponent implements OnInit {
  public searchFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SearchPostsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      search: ['', [Validators.required]]
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  onSearch(formGroup: FormGroup) {
    let data: any = {
      filter: formGroup['value']['search']
    };
  }
}
