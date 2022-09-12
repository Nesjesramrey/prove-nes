import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-root-category',
  templateUrl: './add-root-category.component.html',
  styleUrls: ['./add-root-category.component.scss']
})
export class AddRootCategoryComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public addCategoryFormGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddRootCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.addCategoryFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  onAddCategory(formGroup: FormGroup) {
    let data: any = {
      name: formGroup['value']['name']
    };
    this.utilityService.createNewCategory(data).subscribe((reply: any) => {
      this.dialogRef.close(reply);
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
