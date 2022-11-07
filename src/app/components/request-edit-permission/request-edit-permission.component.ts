import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionService } from 'src/app/services/permission.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.request-edit-permission',
  templateUrl: './request-edit-permission.component.html',
  styleUrls: ['./request-edit-permission.component.scss']
})
export class RequestEditPermissionComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public submitted: boolean = false;
  public formPermission!: FormGroup;
  public layout: any = null;
  public availableLayouts: any = null;
  public document_id: string = '';

  constructor(
    public dialogRef: MatDialogRef<RequestEditPermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public permissionService: PermissionService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.layout = this.dialogData['layout'];
    this.availableLayouts = this.dialogData['layout']['subLayouts'];
    this.document_id = this.dialogData['document_id'];
  }

  ngOnInit(): void {
    this.formPermission = this.formBuilder.group({
      layouts: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  onRequestPermission(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      layout: this.layout['id'],
      description: form['value']['description'],
      sublayouts: form['value']['layouts'],
      document: this.document_id
    };
    this.permissionService.requestAccessPermission(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
      },
      complete: () => {
        this.submitted = false;
        this.killDialog();
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
