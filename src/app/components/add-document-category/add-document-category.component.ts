import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: '.add-document-category',
  templateUrl: './add-document-category.component.html',
  styleUrls: ['./add-document-category.component.scss']
})
export class AddDocumentCategoryComponent implements OnInit {
  public categories: any = [];
  public formControl = new FormControl('');
  public filteredCategories!: Observable<string[]>;
  public categoryCtrl = new FormControl('');
  public categoriesString: any = [];
  public selectedCategories: any = [];
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public layout: any = [];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  public new_category: boolean = false;
  public addCategoryFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityService: UtilityService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    let categories: Observable<any> = this.utilityService.fetchAllCategories();
    forkJoin([categories]).subscribe((reply: any) => {
      // console.log(reply);
      this.categories = reply[0]['clasifications'];
      this.categories.filter((x: any) => { this.categoriesString.push(x['name']); });
      // console.log(this.categories);

      this.addCategoryFormGroup = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2)]]
      });

      this.setFilteredCategories();
    });
  }

  _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.categories.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  onFileSelected(event: any) { }

  filterCategories(value: any) {
    const filterValue = value.toLowerCase();
    return this.categoriesString.filter((category: any) => category.toLowerCase().includes(filterValue));
  }

  setFilteredCategories() {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: any | null) => (
        category ? this.filterCategories(category) : this.categoriesString.slice()
      ))
    );
  }

  removeCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) { this.selectedCategories.splice(index, 1); }
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) { this.selectedCategories.push(value); }
    event.chipInput!.clear();
    this.categoryCtrl.setValue(null);
  }

  categorySelected(event: MatAutocompleteSelectedEvent): void {
    let category: any = this.categories.filter((x: any) => { return x['name'] == event['option']['value'] });
    this.layout.push({ category: category[0]['_id'] });
    this.selectedCategories.push(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  toggleCategoryField() {
    this.new_category = !this.new_category;
    if (!this.new_category) {
      this.addCategoryFormGroup.patchValue({ name: '' });
      this.addCategoryFormGroup.updateValueAndValidity();
    }
  }

  onCreateCategory(form: FormGroup) {
    let data: any = {
      name: this.addCategoryFormGroup.value.name
    }

    this.utilityService.createNewCategory(data).subscribe((reply: any) => {
      // console.log(reply);
      if (reply['status'] == false) {
        this.utilityService.openErrorSnackBar(reply['error']);
        return;
      }

      this.utilityService.openSuccessSnackBar(reply['message']);
      this.categories.push(reply['clasification']);
      this.categoriesString.push(reply['clasification']['name']);
      this.setFilteredCategories();
      this.addCategoryFormGroup.reset();
      this.new_category = false;
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
