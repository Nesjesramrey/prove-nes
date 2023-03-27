import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.marathon-info-dialog',
  templateUrl: './marathon-info-dialog.component.html',
  styleUrls: ['./marathon-info-dialog.component.scss']
})
export class MarathonInfoDialogComponent implements OnInit {
  public windowType: string = '';
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public dialogRef: MatDialogRef<MarathonInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    // console.log(this.dialogData);
    this.windowType = this.dialogData['type'];
    this.isMobile = this.dialogData['isMobile'];
    if (!this.isMobile) { this.class = 'fixDesktop'; }
  }

  ngOnInit(): void { }

  killDialog() { this.dialogRef.close(); }
}
