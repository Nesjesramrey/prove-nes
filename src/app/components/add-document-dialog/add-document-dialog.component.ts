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
  public collaboratorTypes: any = [];
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
    let activities: Observable<any> = this.utilitySrvc.fetchAllActivities();

    forkJoin([states, activities]).subscribe((reply: any) => {
      // console.log(reply);
      this.states = reply[0];
      let national = this.states.filter((state: any) => { return state['code'] == 'NAL'; });
      this.states = this.states.filter((state: any) => { return state['code'] != 'NAL'; });
      this.states.unshift(national[0]);
      // console.log(this.states);
      this.collaboratorTypes = reply[1].filter((x: any) => { return x['value'] == 'editor'; });

      this.documentFormGroup = this.formBuilder.group({
        title: ['', [Validators.required]],
        coverage: ['', []],
        collaborators: this.formBuilder.array([])
      });

      this.collaboratorsFormArray = this.documentFormGroup.get('collaborators') as FormArray;
      this.collaboratorsFormArray.push(this.createCollaboratorField(this.collaboratorTypes[0]['_id']));

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
      _id: this.collaboratorTypes[0]['_id']
    });
  }

  removeCollaboratorField(index: any) {
    this.collaboratorsFormArray.removeAt(index);
  }

  addCollaboratorField() {
    this.collaboratorsFormArray.push(this.createCollaboratorField('editor'));
  }

  onSelectCoverage(evt: any) {
    let national = this.states.filter((state: any) => { return state['_id'] == evt['value']; });
    // if (evt['value'] == national[0]['_id']) {
    //   this.coverageSelect.options.forEach((item: MatOption) => item.disabled = true);
    // }
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

  killDialog() {
    this.dialogRef.close();
  }
}
