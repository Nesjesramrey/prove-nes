import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UtilityService } from 'src/app/services/utility.service';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin, Observable } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: '.give-edit-permission',
  templateUrl: './give-edit-permission.component.html',
  styleUrls: ['./give-edit-permission.component.scss']
})
export class GiveEditPermissionComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public submitted: boolean = false;
  public formPermission!: FormGroup;
  public document_id: string = '';
  public permission_id: string = '';
  public permission: any = null;
  public document: any = null;
  public addCollaboratorFormGroup!: FormGroup;
  public selectedCategories: any = [];
  public categoryCtrl = new FormControl('');
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredCategories!: Observable<string[]>;
  public categoriesString: any = [];
  public availableLayouts: any = null;
  public layout: any = null;
  public layouts: any[] = [];
  public layoutsString: any = [];
  public activities: any[] = [];
  public coverage: any[] = [];
  public editorAllowedActivities: any = ['type-c'];
  public filteredActivities: any = [];
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;
  public selectedLayots: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<GiveEditPermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public permissionService: PermissionService,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public layoutService: LayoutService
  ) {
    this.document_id = this.dialogData['notification']['metadata']['permission']['metadata']['document']['_id'];
    this.permission_id = this.dialogData['notification']['metadata']['permission']['_id'];
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.permissionService.fetchPermissionById({ permission_id: this.permission_id }).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply) => {
        this.permission = reply;
        if (this.permission['isAttended']) {
          this.utilityService.openSuccessSnackBar('Esta petición ya fué atendida.');
          this.killDialog();
        }
      },
      complete: () => {
        console.log(this.permission);
      }
    });

    this.addCollaboratorFormGroup = this.formBuilder.group({
      layouts: ['', [Validators.required]],
      email: [this.dialogData['notification']['message_from']['email'], [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
      activity: ['', [Validators.required]],
      coverage: ['', [Validators.required]]
    });

    let activities: Observable<any> = this.utilityService.fetchAllActivities();
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.document_id });

    forkJoin([activities, document]).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        // console.log(reply);
        this.activities = reply[0];
        this.filteredActivities = this.activities.filter(
          (e: any) => {
            return this.editorAllowedActivities.includes(e['value']);
          }, this.editorAllowedActivities);

        this.document = reply[1];
        this.availableLayouts = this.document['layouts'];
        this.coverage = this.document['coverage'];

        let layout = this.dialogData['notification']['metadata']['permission']['metadata']['layout']['_id'];
        this.layout = this.availableLayouts.filter((x: any) => { return x['_id'] == layout; });

        let layouts = this.dialogData['notification']['metadata']['permission']['metadata']['sublayouts'];
        this.layout[0]['subLayouts'].filter((x: any) => {
          if (layouts.includes(x['_id'])) { this.layoutsString.push(x['category']['name']); }
        });
      },
      complete: () => {
        this.isDataAvailable = true;
        this.setFilteredCategories();
      }
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
    let category: any = this.layout[0]['subLayouts'].filter((x: any) => { return x['category']['name'] == event['option']['value']; });

    if (this.selectedLayots.length != 0) {
      if (this.selectedLayots.includes(category[0]['_id'])) {
        this.utilityService.openErrorSnackBar('Ya se agrego la categoría.');
        this.categoryInput.nativeElement.value = '';
        this.categoryCtrl.setValue(null);
        return;
      }
    }

    this.selectedLayots.push(category[0]['_id']);
    this.selectedCategories.push(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
    this.addCollaboratorFormGroup.patchValue({ layouts: this.selectedLayots });
  }

  addCollaborator(formGroup: FormGroup) {
    this.submitted = true;

    let data: any = {
      document: this.document_id,
      layouts: this.selectedLayots,
      collaborators: [{
        email: formGroup['value']['email'],
        activity: formGroup['value']['activity'],
        coverage: formGroup['value']['coverage']
      }]
    };

    this.layoutService.addLayoutCollaborator(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
      },
      complete: () => {
        this.submitted = false;
        this.dialogRef.close();
        this.permissionService.markPermissionAsAttended({
          permission_id: this.permission['_id']
        }).subscribe({
          error: (error: any) => {
            // console.log(error);
          },
          next: (reply: any) => {
            // console.log(reply);
          }
        });
      }
    });
  }

  filterCategories(value: any) {
    const filterValue = value.toLowerCase();
    return this.categoriesString.filter((category: any) => category.toLowerCase().includes(filterValue));
  }

  setFilteredCategories() {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: any | null) => (
        category ? this.filterCategories(category) : this.layoutsString.slice()
      ))
    );
  }

  killDialog() {
    this.dialogRef.close();
  }
}
