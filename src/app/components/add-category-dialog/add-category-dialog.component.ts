import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent implements OnInit {
  public coverage: any[] = [];
  public documentCoverage: any = [];
  public documentCoverageIds: any = [];
  public isDataAvailable: boolean = false;
  public submitted: boolean = false;
  public coverageFormControl = new FormControl([], [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public documentService: DocumentService
  ) {
    // console.log(this.dialogData);
    this.documentCoverage = this.dialogData['document']['coverage'];
    this.documentCoverage.filter((x: any) => { this.documentCoverageIds.push(x['_id']); });
  }

  ngOnInit(): void {
    this.utilityService.fetchAllStates().subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        this.coverage = reply;

        let coverage = this.coverage.filter((e: any) => {
          return this.documentCoverageIds.includes(e['_id']);
        }, this.documentCoverageIds);

        this.coverage = this.coverage.filter((e: any) => {
          return !this.documentCoverageIds.includes(e['_id']);
        }, this.documentCoverageIds);

        this.documentCoverage = [];
        this.documentCoverage = coverage;
        this.documentCoverage.filter((x: any) => { this.coverage.push(x); });

        this.coverageFormControl.setValue(this.documentCoverage);
      },
      complete: () => {
        this.isDataAvailable = true;
      }
    });
  }

  onAddCoverage() {
    let coverage: any = [];
    this.coverageFormControl['value'].filter((x: any) => { coverage.push(x['_id']); });

    let data: any = {
      documentID: this.dialogData['document']['_id'],
      coverage: coverage
    };

    this.documentService.editDocumentData(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
