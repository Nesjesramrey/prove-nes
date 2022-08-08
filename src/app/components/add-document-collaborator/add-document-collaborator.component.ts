import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: '.add-document-collaborator',
  templateUrl: './add-document-collaborator.component.html',
  styleUrls: ['./add-document-collaborator.component.scss']
})
export class AddDocumentCollaboratorComponent implements OnInit {
  public categories: any = [];
  public states: any = [];
  public selectedCategories: any = [];
  public categoryCtrl = new FormControl('');
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public layout: any = [];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  public filteredCategories!: Observable<string[]>;
  public categoriesString: any = [];
  public addCategoryFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentCollaboratorComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilitiService: UtilityService,
    public formBuilder: FormBuilder
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void {
    let categories: Observable<any> = this.utilitiService.fetchAllCategories();
    let states: Observable<any> = this.utilitiService.fetchAllStatesMex();
    forkJoin([categories, states]).subscribe((reply: any) => {
      // console.log(reply);
      this.categories = reply[0]['clasifications'];
      this.categories.filter((x: any) => { this.categoriesString.push(x['name']); });
      // console.log(this.categories);
      this.states = reply[1]['states'];
      // console.log(this.states);

      this.addCategoryFormGroup = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2)]]
      });

      this.setFilteredCategories();
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
    let category: any = this.categories.filter((x: any) => { return x['name'] == event['option']['value'] });
    this.layout.push({ category: category[0]['_id'] });
    this.selectedCategories.push(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

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

  killDialog() {
    this.dialogRef.close();
  }
}
