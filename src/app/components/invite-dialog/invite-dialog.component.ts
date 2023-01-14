import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.scss']
})
export class InviteDialogComponent implements OnInit {
  public inviteByEmailFormGroup!: FormGroup;
  public inviteByWhatsAppFormGroup!: FormGroup;
  public submitted: boolean = false;
  public media: string = '';

  constructor(
    public dialogRef: MatDialogRef<InviteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.inviteByEmailFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]]
    });

    this.inviteByWhatsAppFormGroup = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]]
    });
  }

  onSelectMedia(media: string) {
    this.media = media;
    this.inviteByEmailFormGroup.reset();
    this.inviteByWhatsAppFormGroup.reset();
  }

  onPhoneInvite(formGroup: FormGroup) {
    let data: any = { phone: formGroup['value']['phone'] };
    window.open(`https://api.whatsapp.com/send?phone=${data['phone']}&text=https://mexicolectivo.com`);
  }

  onEmailInvite(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = { email: formGroup['value']['email'] };
    this.utilityService.inviteUserToMexicolectivo(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['emailSendSuccess']);
      },
      complete: () => {
        this.killDialog();
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
