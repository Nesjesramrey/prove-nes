import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchService } from 'src/app/services/search.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  public searchFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public searchService: SearchService,
    public utilityService: UtilityService
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
      filter: formGroup['value']['search'],
      document_id: this.dialogData['document_id']
    };

    this.searchService.globalSearch(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.searchService.searchSubject.next(reply);
        this.utilityService.linkMe('/search');
      },
      complete: () => {
        this.killDialog();
      }
    });
  }
}
