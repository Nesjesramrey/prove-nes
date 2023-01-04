import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.filter-coverage-dialog',
  templateUrl: './filter-coverage-dialog.component.html',
  styleUrls: ['./filter-coverage-dialog.component.scss']
})
export class FilterCoverageDialogComponent implements OnInit {
  public coverage: any = null;
  public selectedCoverage: string = '';

  constructor(
    public dialogRef: MatDialogRef<FilterCoverageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    console.log(this.dialogData);
    this.coverage = this.dialogData['coverage'];
  }

  ngOnInit(): void { }

  onCoverageSelected(event: any) {
    this.selectedCoverage = event['value'];
    this.dialogRef.close({ selectedCoverage: this.selectedCoverage });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
