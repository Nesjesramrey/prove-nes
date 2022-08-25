import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    { type: 'citizen', displayName: 'Ciudadano', disabled: true }
  ];
  public statesMex: any = [];
  public submitted: boolean = false;
  public isDataAvailable: boolean = false;

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
    forkJoin([states]).subscribe((reply) => {
      console.log({reply});
      this.statesMex = reply[0];
      this.documentFormGroup = this.formBuilder.group({
        title: ['', [Validators.required]],
        coverage: ['', []],
        collaborators: this.formBuilder.array([])
      });
      this.collaboratorsFormArray = this.documentFormGroup.get('collaborators') as FormArray;
      this.collaboratorsFormArray.push(this.createCollaboratorField('editor'));
      this.isDataAvailable = true;
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
    // this.submitted = true;
    formGroup['value']['collaborators'].filter((x: any) => { x['activity'] = x['_id']; });

    let data: any = {
      created_by: this.dialogData['created_by'],
      title: formGroup['value']['title'],
      coverage: formGroup['value']['coverage'],
      collaborators: formGroup['value']['collaborators']
    };

    this.documentSrvc.createNewDocument(data).subscribe((reply: any) => {
      console.log(reply);
      this.submitted = false;
      if (reply['status'] == false) {
        // this.utilitySrvc.openErrorSnackBar(reply['error']);
        return;
      }

      // this.notificationSrvc.createNewNotification({
      //   type: 'document_invite',
      //   message_to: reply['message_to'],
      //   message_from: reply['message_from'],
      //   document: reply['document']['_id'],
      //   message: 'Te han invitado a colaborar'
      // }).subscribe((reply: any) => {
      //   this.socketSrvc.putNotification({ new_notification: true });
      // });

      // this.utilitySrvc.openSuccessSnackBar(reply['message']);
      // this.dialogRef.close(reply);
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
