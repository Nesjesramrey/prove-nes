import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: '.share-whatsapp',
  templateUrl: './share-whatsapp.component.html',
  styleUrls: ['./share-whatsapp.component.scss']
})
export class ShareWhatsappComponent implements OnInit {
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ShareWhatsappComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]]
    });
  }

  onPhoneInvite(formGroup: FormGroup) {
    let data: any = { phone: formGroup['value']['phone'] };
    window.open(`https://api.whatsapp.com/send?phone=${data['phone']}&text=${this.dialogData['url']}`);
    this.killDialog();
  }

  killDialog() { this.dialogRef.close(); }
}
