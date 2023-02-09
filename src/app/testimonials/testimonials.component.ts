import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WindowAlertComponent } from '../components/window-alert/window-alert.component';
import { SingleTestimonyDialogComponent } from '../components/single-testimony-dialog/single-testimony-dialog.component';
import { TestimonyService } from '../services/testimony.service';
import { UserService } from '../services/user.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.testimonials-page',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  public user: any = null;
  public userActivities: any=[];
  public testimonies: any = null;
  public displayedColumns: string[] = ['author', 'title', 'date', 'menu'];
  public dataSource!: MatTableDataSource<any>;
  public isDataAvailable: boolean = false;
  public isPrivate: boolean = false;
  public isMobile: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public testimonyService: TestimonyService,
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

    let testimonies: Observable<any> = this.testimonyService.fetchAllTestimonies();
    forkJoin([testimonies]).subscribe((reply: any) => {
      // console.log(reply);
      this.testimonies = reply[0];
      console.log(this.testimonies);

      this.dataSource = new MatTableDataSource(this.testimonies);
      this.dataSource.paginator = this.paginator;
      this.isDataAvailable = true
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  attendTestimony(testimony: any) {
    const dialogRef = this.dialog.open<SingleTestimonyDialogComponent>(
      SingleTestimonyDialogComponent, {
      // width: '640px',
      data: {
        testimony: testimony
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popSingleTestimony(testimony_id: string) {
    console.log(testimony_id);
    window.open('/testimonios/' + testimony_id);
  }

  killTestimony(testimony_id: string) {
    let testtimony: any = this.testimonies.filter((x: any) => { return x['_id'] == testimony_id; });

    const dialogRef = this.dialog.open<WindowAlertComponent>(
      WindowAlertComponent, {
      width: '420px',
      data: {
        windowType: 'testimony',
        testimony: testtimony[0]
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.testimonies = this.testimonies.filter((x: any) => { return x['_id'] != testimony_id; });
        this.dataSource = new MatTableDataSource(this.testimonies);
        this.dataSource.paginator = this.paginator;
      }
    });
  }
}
