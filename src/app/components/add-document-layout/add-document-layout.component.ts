import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { DocumentService } from 'src/app/services/document.service';

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
  public layout: any = [];
  public addNewCategory: boolean = false;
  public addCategoryFormGroup!: FormGroup;
  public isSubmitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentLayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityservice: UtilityService,
    public formBuilder: FormBuilder,
    public documentService: DocumentService
  ) {
    // console.log(this.dialogData);
    this.document = this.dialogData['document'];
  }

  ngOnInit(): void {
    let categories: Observable<any> = this.utilityservice.fetchAllCategories();
    forkJoin([categories]).subscribe((reply: any) => {
      // console.log(reply);
      this.categories = reply[0];
      this.categories.filter((x: any) => { this.categoriesString.push(x['name']); });

      this.stepOneFormGroup = this.formBuilder.group({
        description: ['', []],
        files: ['', []]
      });

      this.stepTwoFormGroup = this.formBuilder.group({
        layout: ['', [Validators.required]]
      });

      this.addCategoryFormGroup = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2)]]
      });

      this.setFilteredCategories();
      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
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
    this.stepTwoFormGroup.patchValue({ layout: this.selectedCategories });
  }

  categorySelected(event: MatAutocompleteSelectedEvent): void {
    let category: any = this.categories.filter((x: any) => { return x['name'] == event['option']['value'] });

    if (this.selectedCategories.includes(event.option.value)) {
      this.utilityservice.openErrorSnackBar('Ya se agrego la categoría.');
      this.categoryInput.nativeElement.value = '';
      this.categoryCtrl.setValue(null);
      return;
    }

    this.layout.push(category[0]['_id']);
    this.stepTwoFormGroup.patchValue({ layout: this.layout });
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

  onFileSelected(event: any) {
    // let ext: any;
    // if (event.target.files.length == 0) {
    //   return;
    // } else {
    //   ext = event.target.files[0].name.substr(event.target.files[0].name.lastIndexOf('.') + 1);
    // }

    // if (!this.utilityservice.image_extensions.includes(ext)) {
    //   this.utilityservice.openErrorSnackBar('Solo archivos de tipo imágen son permitidos');
    //   return;
    // }

    this.stepOneFormGroup.patchValue({ files: event.target.files[0] });
    this.stepOneFormGroup.updateValueAndValidity();
    // console.log(this.stepOneFormGroup.controls);
  }

  onCreateLayout() {
    this.isSubmitted = true;
    let files: File;
    let data = {
      formData: new FormData(),
      documentID: this.document['_id']
    };

    files = this.stepOneFormGroup.get('files')?.value;
    data['formData'].append('files', files);
    data['formData'].append('description', this.stepOneFormGroup.value.description);
    data['formData'].append('categories', JSON.stringify(this.layout));

    this.documentService.createDocumentLayout(data).subscribe((reply) => {
      // console.log(reply);
      this.dialogRef.close(reply);
      this.isSubmitted = false;
    });
  }

  toggleCategoryField() {
    this.addNewCategory = !this.addNewCategory;
    if (!this.addNewCategory) {
      this.addCategoryFormGroup.patchValue({ name: '' });
      this.addCategoryFormGroup.updateValueAndValidity();
    }
  }

  setFilteredCategories() {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: any | null) => (
        category ? this.filterCategories(category) : this.categoriesString.slice()
      ))
    );
  }

  onCreateCategory(form: FormGroup) {
    let data: any = {
      name: this.addCategoryFormGroup.value.name
    }

    this.utilityservice.createNewCategory(data).subscribe((reply: any) => {
      // console.log(reply);
      this.utilityservice.openSuccessSnackBar('¡Se agrego correctamente!');
      this.categories.push(reply);
      this.categoriesString.push(reply['name']);
      this.selectedCategories.push(reply['name']);
      this.stepTwoFormGroup.patchValue({ layout: this.selectedCategories });
      this.setFilteredCategories();
      this.addCategoryFormGroup.reset();
      this.addNewCategory = false;
    });
  }
}
