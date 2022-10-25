import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
      layout_id: this.layout['id'],
      description: form['value']['description'],
      layouts: form['value']['layouts'],
      document_id: this.document_id
    };
    console.log(data);
  }

  killDialog() {
    this.dialogRef.close();
  }
}
