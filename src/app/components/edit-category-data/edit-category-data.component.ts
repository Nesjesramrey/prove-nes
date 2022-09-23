import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.edit-category-data-dialog',
  templateUrl: './edit-category-data.component.html',
  styleUrls: ['./edit-category-data.component.scss']
})
export class EditCategoryDataComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public layout: any = null;
  public category: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public categoryService: CategoryService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.layout = this.dialogData['layout'];
    // console.log('layout: ', this.layout);
    this.category = this.dialogData['layout']['category'];
    // console.log('category: ', this.category);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      category: [this.category['name'], [Validators.required]],
      description: [this.layout['description'], [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  editLayout(formGroup: FormGroup) {
    this.submitted = true;

    let data: any = {
      categoryID: this.category['_id'],
      name: formGroup['value']['category'],
      layoutID: this.layout['_id'],
      description: formGroup['value']['description']
    };

    let category: Observable<any> = this.categoryService.editCategory(data);
    let layout: Observable<any> = this.layoutService.editLayoutData(data);

    forkJoin([category, layout]).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.editedSuccess);
        this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
