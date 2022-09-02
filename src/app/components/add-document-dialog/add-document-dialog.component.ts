import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.scss']
})
export class AddDocumentDialogComponent implements OnInit {
  public documentFormGroup!: FormGroup;
  public collaboratorsFormArray!: FormArray;
  public collaboratorTypes: any = [
    { type: 'administrator', displayName: 'Administrador', disabled: true },
    { type: 'editor', displayName: 'Editor', disabled: false },
    { type: 'collaborator', displayName: 'Colaborador', disabled: true },
    { type: 'citizen', displayName: 'Ciudadano', disabled: true },
    { type: 'D', displayName: 'D', disabled: true }
  ];
  public states: any = [];
  public activities: any = [];
  public submitted: boolean = false;
  public isDataAvailable: boolean = false;
  @ViewChild('coverageSelect') public coverageSelect!: MatSelect;

  constructor(
    public dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentSrvc: DocumentService,
    public utilitySrvc: UtilityService,
    public notificationSrvc: NotificationService,
    public socketSrvc: SocketService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    let states: Observable<any> = this.utilitySrvc.fetchAllStates();
    // let activities: Observable<any> = this.utilitySrvc.fetchAllCategories();

    forkJoin([states]).subscribe((reply: any) => {
      // console.log(reply);
      this.states = reply[0];
      // console.log('states: ', this.states);
      // this.activities = reply[1];
      // console.log('activities: ', this.activities);

      this.documentFormGroup = this.formBuilder.group({
        title: ['', [Validators.required]],
        coverage: ['', []],
        collaborators: this.formBuilder.array([])
      });

      this.collaboratorsFormArray = this.documentFormGroup.get('collaborators') as FormArray;
      this.collaboratorsFormArray.push(this.createCollaboratorField('editor'));

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 100);
    });
  }

  get collaboratorForm() {
    return this.documentFormGroup.get('collaborators') as FormArray;
  }

  createCollaboratorField(activity: string): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required]],
      activity: [activity, [Validators.required]],
      _id: '62fcebae6d498ad2bf077c4f'
    });
  }

  removeCollaboratorField(index: any) {
    this.collaboratorsFormArray.removeAt(index);
  }

  addCollaboratorField() {
    this.collaboratorsFormArray.push(this.createCollaboratorField('editor'));
  }

  onCreateDocument(formGroup: FormGroup) {
    this.submitted = true;
    formGroup['value']['collaborators'].filter((x: any) => { x['activity'] = x['_id']; });
    if (formGroup['value']['coverage'].includes('all')) {
      const index = formGroup['value']['coverage'].indexOf('all');
      if (index > -1) {
        formGroup['value']['coverage'].splice(index, 1);
      }
    }

    let data: any = {
      created_by: this.dialogData['created_by'],
      title: formGroup['value']['title'],
      coverage: formGroup['value']['coverage'],
      collaborators: formGroup['value']['collaborators']
    };

    this.documentSrvc.createNewDocument(data).subscribe((reply: any) => {
      // console.log(reply);
      this.submitted = false;
      this.dialogRef.close(reply);
    });
  }

  onSelectCoverage(evt: any) {
    if (evt['value'].includes('all')) {
      this.coverageSelect.options.forEach((item: MatOption) => item.select());
    } else {
      // this.coverageSelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  killDialog() {
    this.dialogRef.close();
  }
}
