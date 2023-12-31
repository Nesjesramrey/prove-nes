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
import { LayoutService } from 'src/app/services/layout.service';

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
  public layouts: any = [];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  public filteredCategories!: Observable<string[]>;
  public categoriesString: any = [];
  public document: any = null;
  public layout: any = null;
  public subLayout: any = null;
  public coverage: any = null;
  public availableLayouts: any = null;
  public addCollaboratorFormGroup!: FormGroup;
  public submitted: boolean = false;
  @ViewChild('coverageSelect') public coverageSelect!: MatSelect;
  public user: any = null;
  public allActivities: any = [];
  public userActivity: string = '';
  public editorAllowedActivities: any = [];
  public selectedActivity: any = null;
  public filteredActivities: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddDocumentCollaboratorComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilitiService: UtilityService,
    public formBuilder: FormBuilder,
    public utilitySrvc: UtilityService,
    public layoutService: LayoutService
  ) {
    // console.log(this.dialogData);
    this.document = this.dialogData['document'];
    this.layout = this.dialogData['layout'];
    this.subLayout = this.dialogData['subLayout'];
    this.coverage = this.dialogData['coverage'];
    this.user = this.dialogData['user'];
    this.userActivity = this.user['activityName'];

    switch (this.userActivity) {
      case 'administrator':
        // this.editorAllowedActivities = ['editor', 'type-a', 'type-b', 'type-c', 'type-d'];
        this.editorAllowedActivities = ['editor', 'type-c'];
        break;
      case 'editor':
        // this.editorAllowedActivities = ['type-a', 'type-b', 'type-c', 'type-d'];
        this.editorAllowedActivities = ['type-c'];
        break;
      case 'citizen':
        // this.editorAllowedActivities = ['type-c', 'type-d'];
        this.editorAllowedActivities = ['type-c'];
        break;
    }
  }

  ngOnInit(): void {
    switch (this.dialogData['location']) {
      case 'document':
        this.availableLayouts = this.document['layouts'];
        break;
      case 'layout':
        this.availableLayouts = this.layout['subLayouts'];
        break;
      case 'subLayout':
        // this.availableLayouts = this.dialogData['topics'];
        this.availableLayouts = [];
        this.availableLayouts.push(this.dialogData['subLayout']);
        break;
    }

    this.availableLayouts.filter((x: any) => { this.categories.push(x); });
    this.categories.filter((x: any) => {
      if (this.dialogData['location'] == 'document') {
        this.categoriesString.push(x['category']['name']);
      }
      else if (this.dialogData['location'] == 'subLayout') {
        this.categoriesString.push(x['category']['name']);
      }
      else {
        this.categoriesString.push(x['name']);
      }
    });
    // console.log(this.categories);

    // this.utilitiService.fetchAllStates().subscribe((reply: any) => {
    //   console.log(reply);
    // });

    this.states = this.document['coverage'];
    this.setFilteredCategories();

    this.addCollaboratorFormGroup = this.formBuilder.group({
      layouts: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.utilitySrvc.emailPattern), this.utilitySrvc.emailDomainValidator]],
      activity: ['', [Validators.required]],
      coverage: ['', [Validators.required]]
    });

    this.utilitySrvc.fetchAllActivities().subscribe((reply: any) => {
      this.allActivities = reply;
      this.filteredActivities = this.allActivities.filter(
        (e: any) => {
          return this.editorAllowedActivities.includes(e['value']);
        }, this.editorAllowedActivities);
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
    let category: any;

    if (this.dialogData['location'] == 'document') {
      category = this.categories.filter((x: any) => { return x['category']['name'] == event['option']['value'] });
      let layout = this.availableLayouts.filter((x: any) => { return x['category']['_id'] == category[0]['category']['_id']; });
      this.layouts.push(layout[0]['_id']);
    }
    else if (this.dialogData['location'] == 'subLayout') {
      category = this.categories.filter((x: any) => { return x['category']['name'] == event['option']['value'] });
      let layout = this.availableLayouts.filter((x: any) => { return x['_id'] == category[0]['_id']; });
      this.layouts.push(layout[0]['_id']);
    }
    else {
      category = this.categories.filter((x: any) => { return x['name'] == event['option']['value'] });
      let layout = this.availableLayouts.filter((x: any) => { return x['id'] == category[0]['id']; });
      this.layouts.push(layout[0]['id']);
    }

    this.selectedCategories.push(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);

    switch (this.dialogData['location']) {
      case 'document':
        this.addCollaboratorFormGroup.patchValue({ layouts: category[0]['_id'] });
        break;
      case 'layout':
        this.addCollaboratorFormGroup.patchValue({ layouts: category[0]['id'] });
        break;
      case 'subLayout':
        this.addCollaboratorFormGroup.patchValue({ layouts: category[0]['_id'] });
        break;
    }
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

  onSelectType(event: any) {
    this.addCollaboratorFormGroup.patchValue({ activity: event['value'] });
  }

  onSelectCoverage(evt: any) {
    this.addCollaboratorFormGroup.patchValue({ coverage: evt.value });
  }

  addCollaborator(formGroup: FormGroup) {
    this.submitted = true;

    let data: any = {
      document: this.document['_id'],
      layouts: this.layouts,
      collaborators: [{
        email: formGroup['value']['email'],
        activity: formGroup['value']['activity'],
        coverage: formGroup['value']['coverage']
      }]
    };

    this.layoutService.addLayoutCollaborator(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilitiService.openErrorSnackBar(this.utilitiService.errorOops);
      },
      next: (reply: any) => {
        // console.log(reply);
        this.utilitiService.openSuccessSnackBar(this.utilitiService.userAddedSuccesss);
        this.dialogRef.close(reply)
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
