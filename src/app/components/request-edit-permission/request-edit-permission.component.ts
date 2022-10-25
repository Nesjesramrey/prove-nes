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

  constructor(
    public dialogRef: MatDialogRef<RequestEditPermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
  ) {
    console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.formPermission = this.formBuilder.group({
      description: ['', [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  onRequestPermission(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      layout_id: this.dialogData['layout']['id'],
      description: form['value']['description'],
      user_id: ''
    };
    console.log(data);
  }

  killDialog() {
    this.dialogRef.close();
  }
}
