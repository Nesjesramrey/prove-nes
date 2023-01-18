import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { SingleComplaintComponent } from '../components/single-complaint/single-complaint.component';
import { ComplaintService } from '../services/complaint.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.complaints-page',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  public complaints: any = null;
  public displayedColumns: string[] = ['author', 'title', 'date', 'menu'];
  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public complaintService: ComplaintService,
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let complaints: Observable<any> = this.complaintService.fetchAllComplaints();
    forkJoin([complaints]).subscribe((reply: any) => {
      // console.log(reply);
      this.complaints = reply[0];
      console.log(this.complaints);
      this.dataSource = new MatTableDataSource(this.complaints);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  attendComplaint(complaint: any) {
    const dialogRef = this.dialog.open<SingleComplaintComponent>(
      SingleComplaintComponent, {
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
    let data: any = { complaint_id: complaint_id };
    this.complaintService.killComplaint(data).subscribe({
      error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
      next: (reply: any) => {
        this.complaints = this.complaints.filter((x: any) => { return x['_id'] != complaint_id; });
        this.dataSource = new MatTableDataSource(this.complaints);
        this.dataSource.paginator = this.paginator;
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => { }
    });
  }
}
