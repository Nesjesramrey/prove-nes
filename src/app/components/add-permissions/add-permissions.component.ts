import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: '.add-permissions-dialog',
  templateUrl: './add-permissions.component.html',
  styleUrls: ['./add-permissions.component.scss']
})
export class AddPermissionsComponent implements OnInit {
  public permissionsFormControl = new FormControl();
  public permissionList = ['Administrador'];

  constructor(
    public dialogRef: LyDialogRef,
    @Inject(LY_DIALOG_DATA) public dialogData: any
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void { }

  onAddPermissions() {
    console.log(this.permissionsFormControl['value']);
  }
}
