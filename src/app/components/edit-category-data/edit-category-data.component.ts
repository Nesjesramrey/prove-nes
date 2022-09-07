import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: '.edit-category-data-dialog',
  templateUrl: './edit-category-data.component.html',
  styleUrls: ['./edit-category-data.component.scss']
})
export class EditCategoryDataComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public layout: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public layoutService: LayoutService
  ) {
    // console.log(this.dialogData);
    this.layout = this.dialogData['layout'];
    // console.log('layout: ', this.layout);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      description: [this.layout['description'], [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  editLayout(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      layoutID: this.layout['_id'],
      description: formGroup['value']['description']
    };
    this.layoutService.editLayoutData(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
      },
      next: (reply: any) => {
        this.submitted = false;
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
