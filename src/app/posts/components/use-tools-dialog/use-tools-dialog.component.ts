import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.use-tools-dialog',
  templateUrl: './use-tools-dialog.component.html',
  styleUrls: ['./use-tools-dialog.component.scss']
})
export class UseToolsDialogComponent implements OnInit {
  public isMobile: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UseToolsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public utilityService: UtilityService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    // console.log(this.dialogData);
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void { }

  linkLogin() {
    this.killDialog();
    if (this.isMobile) {
      this.utilityService.linkMe('/hub/signin-mobile');
    } else {
      this.utilityService.linkMe('/hub/ingresar');
    }
  }

  linkRegister() {
    this.killDialog();
    if (this.isMobile) {
      this.utilityService.linkMe('/hub/signup-mobile');
    } else {
      this.utilityService.linkMe('/hub/registro');
    }
  }

  killDialog() { this.dialogRef.close(); }
}
