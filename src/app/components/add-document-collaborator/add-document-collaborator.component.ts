import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: '.add-document-collaborator',
  templateUrl: './add-document-collaborator.component.html',
  styleUrls: ['./add-document-collaborator.component.scss']
})
export class AddDocumentCollaboratorComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public categories: any = [];
  public states: any = [];
  public selectedCategories: any = [];
  public categoryCtrl = new FormControl('');
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public layout: any = [];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  public filteredCategories!: Observable<string[]>;
  public categoriesString: any = [];
  public document: any = null;
  public layouts: any = null;
  public addCollaboratorFormGroup!: FormGroup;
  public submitted: boolean = false;
  @ViewChild('coverageSelect') public coverageSelect!: MatSelect;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentCollaboratorComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilitiService: UtilityService,
    public formBuilder: FormBuilder,
    public utilitySrvc: UtilityService
  ) {
    // console.log(this.dialogData);
    this.document = this.dialogData['document'];
  }

  ngOnInit(): void {
    this.layouts = this.document['layouts'];
    this.layouts.filter((x: any) => { this.categories.push(x['category']); });
    this.categories.filter((x: any) => { this.categoriesString.push(x['name']); });
    this.states = this.document['coverage'];
    this.setFilteredCategories();
    this.addCollaboratorFormGroup = this.formBuilder.group({
      layouts: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.utilitySrvc.emailPattern), this.utilitySrvc.emailDomainValidator]],
      activity: ['', [Validators.required]],
      coverage: ['', [Validators.required]]
    });
    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
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
    this.layout.push(category[0]['_id']);
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

  onSelectCoverage(evt: any) {
    if (evt['value'].includes('all')) {
      this.coverageSelect.options.forEach((item: MatOption) => item.select());
    } else {
      // this.coverageSelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  addCollaborator(formGroup: FormGroup) {
    this.submitted = true;
    if (formGroup['value']['coverage'].includes('all')) {
      const index = formGroup['value']['coverage'].indexOf('all');
      if (index > -1) {
        formGroup['value']['coverage'].splice(index, 1);
      }
    }
    let data: any = {
      layots: this.layout,
      email: formGroup['value']['email'],
      activity: '',
      coverage: formGroup['value']['coverage']
    };
    console.log(data);
  }

  killDialog() {
    this.dialogRef.close();
  }
}
