import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SingleComplaintDialogComponent } from '../components/single-complaint-dialog/single-complaint-dialog.component';
import { WindowAlertComponent } from '../components/window-alert/window-alert.component';
import { ComplaintService } from '../services/complaint.service';
import { UserService } from '../services/user.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.complaints-page',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  public complaints: any = null;
  public isDataAvailable: boolean = false;
  public isPrivate: boolean = false;
  public isMobile: boolean = false;
  public displayedColumns: string[] = ['author', 'title', 'date', 'menu'];
  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public user: any = null;
  public userActivities: any = [];

  constructor(
    public complaintService: ComplaintService,
    public userService: UserService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public deviceDetectorService: DeviceDetectorService,
  ) { 
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {

    this.userService.fetchFireUser().subscribe({
      error: (error: any) => {
        console.log(error)
      },
      next: (reply: any) => {
        this.user = reply;      
        this.user['activityName'] = this.user['activities'][0]['value'];
        //console.log('user: ', this.user);
        this.user['activities'].filter((x: any) => { this.userActivities.push(x['value']); });
        // console.log(this.userActivities); 
        if (this.userActivities.includes('moderator')) {
          setTimeout(() => {
            this.isPrivate = true;
          });
        }
 
      },
      complete: () => {
       }
    });

    let complaints: Observable<any> = this.complaintService.fetchAllComplaints();
    forkJoin([complaints]).subscribe((reply: any) => {
      // console.log(reply);
      this.complaints = reply[0];
      // console.log(this.complaints);
      this.dataSource = new MatTableDataSource(this.complaints);
      this.dataSource.paginator = this.paginator;
      this.isDataAvailable = true
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  attendComplaint(complaint: any) {
    const dialogRef = this.dialog.open<SingleComplaintDialogComponent>(
      SingleComplaintDialogComponent, {
      // width: '640px',
      data: {
        complaint: complaint
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  killCompalint(complaint_id: string) {
    let complaint: any = this.complaints.filter((x: any) => { return x['_id'] == complaint_id; });

    const dialogRef = this.dialog.open<WindowAlertComponent>(
      WindowAlertComponent, {
      width: '420px',
      data: {
        windowType: 'complaint',
        complaint: complaint[0]
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.complaints = this.complaints.filter((x: any) => { return x['_id'] != complaint_id; });
        this.dataSource = new MatTableDataSource(this.complaints);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  popSingleComplaint(complaint_id: string) {
    //console.log(complaint_id);
    window.open('/denuncias/' + complaint_id);
  }
}
