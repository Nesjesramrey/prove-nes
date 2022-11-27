import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LayoutService } from 'src/app/services/layout.service';
import { AddRootCategoryComponent } from '../add-root-category/add-root-category.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: '.add-document-category',
  templateUrl: './add-document-category.component.html',
  styleUrls: ['./add-document-category.component.scss'],
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
  public addCategoryValidated: boolean = false;
  @ViewChild(MatAutocompleteTrigger) public auto!: MatAutocompleteTrigger;
  public newCategoryName: string = '';

  public stepOneFormGroup!: FormGroup;
  public stepTwoFormGroup!: FormGroup;

  public isDataAvailable: boolean = false;
  public selectedCategoryId: any = null;
  public addedLayouts: any = [];
  public fileNames: any = [];
  public isSubmitted: boolean = false;

  public htmlContent: any = '';
  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Descripción...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<AddDocumentCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityService: UtilityService,
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public dialog: MatDialog,
    public utilityservice: UtilityService
  ) {
    // console.log(this.dialogData);
    this.dialogData['document']['layouts'].filter((x: any) => {
      this.addedLayouts.push(x['category']['_id']);
    });
  }

  ngOnInit(): void {
    let categories: Observable<any> = this.utilityService.fetchAllCategories();
    forkJoin([categories]).subscribe((reply: any) => {
      // console.log(reply);
      this.categories = reply[0];
      this.categories.filter((x: any) => {
        this.categoriesString.push(x['name']);
      });
      // console.log(this.categories);

      this.stepOneFormGroup = this.formBuilder.group({
        description: ['', []],
        files: ['', []],
      });

      this.stepTwoFormGroup = this.formBuilder.group({
        layout: ['', [Validators.required]],
      });

      // remove
      this.addCategoryFormGroup = this.formBuilder.group({
        description: ['', []],
        files: ['', []],
        category: ['', []],
      });

      this.setFilteredCategories();
      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
    });
  }

  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => {
      this.fileNames.push(file['name']);
    });
    this.stepOneFormGroup.patchValue({ files: event.target.files });
    this.stepOneFormGroup.updateValueAndValidity();
  }

  filterCategories(value: any) {
    const filterValue = value.toLowerCase();
    return this.categoriesString.filter((category: any) =>
      category.toLowerCase().includes(filterValue)
    );
  }

  setFilteredCategories() {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: any | null) =>
        category
          ? this.filterCategories(category)
          : this.categoriesString.slice()
      )
    );
  }

  removeCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) { this.selectedCategories.splice(index, 1); }
    if (this.categoryCtrl.disabled) {
      this.categoryCtrl.enable();
      this.addCategoryValidated = false;
    }
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedCategories.push(value);
    }
    event.chipInput!.clear();
    this.categoryCtrl.setValue(null);
  }

  onEnter(event: any) {
    this.newCategoryName = this.selectedCategories[0];

    let category: any[] = this.categories.filter((x: any) => {
      return x['name'] == this.newCategoryName;
    });

    if (category.length == 0) {
      this.addCategoryValidated = true;
    } else {
      this.addCategoryValidated = false;
    }

    this.auto.closePanel();
    this.categoryCtrl.disable();
    console.log(this.newCategoryName);
  }

  categorySelected(event: MatAutocompleteSelectedEvent): void {
    let category: any[] = this.categories.filter((x: any) => {
      return x['name'] == event['option']['value'];
    });

    if (this.addedLayouts.includes(category[0]['_id'])) {
      this.utilityService.openErrorSnackBar('La categoría ya esta en uso');
      this.categoryInput.nativeElement.value = '';
      this.categoryCtrl.setValue(null);
      return;
    }

    if (this.selectedCategories.length == 1) {
      this.utilityService.openErrorSnackBar('Solo se puede agregar 1 categoría.');
      this.categoryInput.nativeElement.value = '';
      this.categoryCtrl.setValue(null);
      return;
    }

    this.selectedCategoryId = category[0]['_id'];
    this.stepTwoFormGroup.patchValue({ layout: this.selectedCategoryId });
    this.selectedCategories.push(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  onCreateCategory(form: FormGroup) {
    let data: any = {
      name: this.addCategoryFormGroup.value.category,
    };

    // console.log({ category: this.addCategoryFormGroup.value.category });

    this.utilityService.createNewCategory(data).subscribe((reply: any) => {
      // console.log(reply);
      if (reply['status'] == false) {
        this.utilityService.openErrorSnackBar(reply['error']);
        return;
      }
      // console.log({ reply: reply });
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

  popAddRootCategoryDialog() {
    const dialogRef = this.dialog.open<AddRootCategoryComponent>(AddRootCategoryComponent, {
      width: '420px',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        // console.log(reply);
        this.utilityservice.openSuccessSnackBar('¡Se agrego correctamente!');

        this.categories.push(reply);
        this.layout = [];
        this.layout.push(reply['_id']);
        this.categoriesString.push(reply['name']);
        this.selectedCategories = [];
        this.selectedCategories.push(reply['name']);

        this.stepTwoFormGroup.patchValue({ layout: this.layout });
        this.setFilteredCategories();
      }
    });
  }

  onAddLayout() {
    this.isSubmitted = true;
    let data: any;

    if (this.dialogData['type'] != undefined) {
      if (this.dialogData['type'] == 'sublayout') {
        data = {
          formData: new FormData(),
          category: this.dialogData['categoryID'],
        };

        Array.from(this.stepOneFormGroup.controls['files']['value']).forEach(
          (file: any) => {
            data['formData'].append('files', file);
          }
        );
        data['formData'].append(
          'description',
          this.stepOneFormGroup.value.description
        );
        data['formData'].append(
          'category',
          this.stepTwoFormGroup.value.layout
        );

        this.layoutService.createNewSubLayout(data).subscribe((reply: any) => {
          // console.log(reply);
          this.isSubmitted = false;
          this.dialogRef.close(reply['sublayouts']);
        });
      }
    } else {
      data = {
        formData: new FormData(),
        documentID: this.dialogData['documentID'],
      };

      Array.from(this.stepOneFormGroup.controls['files']['value']).forEach(
        (file: any) => {
          data['formData'].append('files', file);
        }
      );
      data['formData'].append(
        'description',
        this.stepOneFormGroup.value.description
      );
      data['formData'].append('category', this.stepTwoFormGroup.value.layout);

      this.layoutService.createNewLayoutOnly(data).subscribe((reply: any) => {
        // console.log(reply);
        this.isSubmitted = false;
        this.dialogRef.close(reply['layouts']);
      });
    }
  }
}
