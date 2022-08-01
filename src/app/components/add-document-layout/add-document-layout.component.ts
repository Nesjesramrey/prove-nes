import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: '.add-document-layout',
  templateUrl: './add-document-layout.component.html',
  styleUrls: ['./add-document-layout.component.scss']
})
export class AddDocumentLayoutComponent implements OnInit {
  public document: any = null;
  public categories: any = [];
  public categoriesString: any = [];
  public categoryCtrl = new FormControl('');
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredCategories!: Observable<any[]>;
  public selectedCategories: any = [];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  public stepOneFormGroup!: FormGroup;
  public stepTwoFormGroup!: FormGroup;
  public isDataAvailable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentLayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityservice: UtilityService,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.dialogData);
    this.document = this.dialogData['document'];
  }

  ngOnInit(): void {
    let categories: Observable<any> = this.utilityservice.fetchAllCategories();
    forkJoin([categories]).subscribe((reply: any) => {
      // console.log(reply);
      this.categories = reply[0]['clasifications'];
      this.categories.filter((x: any) => { this.categoriesString.push(x['name']); });

      this.stepOneFormGroup = this.formBuilder.group({
        description: ['', [Validators.required]],
        file: ['', []]
      });

      this.stepTwoFormGroup = this.formBuilder.group({
        layout: ['', [Validators.required]]
      });

      this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(null),
        map((category: any | null) => (
          category ? this.filterCategories(category) : this.categoriesString.slice()
        ))
      );

      this.isDataAvailable = true;
    });
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) { this.selectedCategories.push(value); }
    event.chipInput!.clear();
    this.categoryCtrl.setValue(null);
  }

  removeCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) { this.selectedCategories.splice(index, 1); }
  }

  categorySelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategories.push(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  filterCategories(value: any) {
    const filterValue = value.toLowerCase();
    return this.categoriesString.filter((category: any) => category.toLowerCase().includes(filterValue));
  }

  killDialog() {
    this.dialogRef.close();
  }

  onCreateLayout() {
    let data: any = {
      documentID: this.document['_id'],
      description: this.stepOneFormGroup.value.description,
      file: this.stepOneFormGroup.value.file,
      layout: this.stepTwoFormGroup.value.layout
    }
    console.log(data);
  }
}
