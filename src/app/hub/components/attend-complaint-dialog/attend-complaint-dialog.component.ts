import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { ComplaintService } from 'src/app/services/complaint.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { WindowAlertComponent } from 'src/app/components/window-alert/window-alert.component';

@Component({
  selector: '.attend-complaint-dialog',
  templateUrl: './attend-complaint-dialog.component.html',
  styleUrls: ['./attend-complaint-dialog.component.scss']
})
export class AttendComplaintDialogComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public complaintID: any = null;
  public complaint: any = null;

  constructor(
    public dialogRef: MatDialogRef<AttendComplaintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public complaintService: ComplaintService,
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) {
    // console.log(this.dialogData);
    this.complaintID = this.dialogData['payload']['complaint']['_id'];
    // console.log(this.complaintID);
  }

  ngOnInit(): void {
    let complaint: Observable<any> = this.complaintService.fetchComplaintById({ complaintID: this.complaintID });
    forkJoin([complaint]).subscribe((reply: any) => {
      // console.log(reply);
      this.complaint = reply[0];
      // console.log('complaint: ', this.complaint);
      this.isDataAvailable = true;
    });
  }

  killDialog() {
    this.dialogRef.close();
  }

  publishComplaint() {
    let data: any = { complaintID: this.complaintID }
    this.complaintService.attendComplaint(data).subscribe({
      error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
      next: (reply: any) => {
        this.complaint['isAttended'] = !this.complaint['isAttended'];
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      }
    });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(ImageViewerComponent, {
      width: '640px',
      data: {
        location: 'complaint',
        user: this.dialogData['user'],
        complaint: this.complaint
      },
      disableClose: true,
      panelClass: 'viewer-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  killComplaint(complaint: any) {
    const dialogRef = this.dialog.open<WindowAlertComponent>(WindowAlertComponent, {
      width: '420px',
      data: {
        windowType: 'complaint',
        complaint: complaint
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
