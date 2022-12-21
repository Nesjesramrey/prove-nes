import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: '.description-viewer-dialog',
  templateUrl: './description-viewer.component.html',
  styleUrls: ['./description-viewer.component.scss']
})
export class DescriptionViewerComponent implements OnInit {
  public text: string = '';
  public title: string = '';
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public dialogRef: MatDialogRef<DescriptionViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { text: string; title: string },
    public deviceDetectorService: DeviceDetectorService
  ) {
    // console.log(this.dialogData);
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.text = this.dialogData.text;
    this.title = this.dialogData.title;
  }

  killDialog() {
    this.dialogRef.close();
  }
}
