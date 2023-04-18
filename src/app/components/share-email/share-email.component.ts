import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.share-email',
  templateUrl: './share-email.component.html',
  styleUrls: ['./share-email.component.scss']
})
export class ShareEmailComponent implements OnInit {
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ShareEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
      message: [this.dialogData['url'], [Validators.required]]
    });
  }

  onEmailInvite(formGroup: FormGroup) {
    this.submitted = true;

    let data: any = {
      email: formGroup['value']['email'],
      message: formGroup['value']['message'],
      type: 'share'
    };

    this.utilityService.shareLinkByEmail(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['emailSendSuccess']);
      },
      complete: () => {
        this.submitted = false;
        this.killDialog();
      }
    });
  }

  killDialog() { this.dialogRef.close(); }
}
