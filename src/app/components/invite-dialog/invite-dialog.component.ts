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
  public inviteFormGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<InviteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.inviteFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
    });
  }

  onInvite(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      email: formGroup['value']['email']
    };
    console.log(data);
  }

  killDialog() {
    this.dialogRef.close();
  }
}
