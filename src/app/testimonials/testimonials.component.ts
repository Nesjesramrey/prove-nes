import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections'
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
import { CategorizePostComponent } from '../components/categorize-post/categorize-post.component';
import { DocumentService } from '../services/document.service';

@Component({
  selector: '.testimonials-page',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  public user: any = null;
  public userActivities: any = [];
  public testimonies: any = null;
  public selection = new SelectionModel<any>(true, []);
  public displayedColumns: string[] = ['select', 'author', 'title', 'relation', 'date', 'menu'];
  public dataSource!: MatTableDataSource<any>;
  public isDataAvailable: boolean = false;
  public isPrivate: boolean = false;
  public isMobile: boolean = false;
  public paginator!: MatPaginator;
  @ViewChild('paginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  public document: any = null;

  constructor(
    public testimonyService: TestimonyService,
    public userService: UserService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public deviceDetectorService: DeviceDetectorService,
    public documentsService: DocumentService
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
    let testimonies: Observable<any> = this.testimonyService.fetchAllTestimonies();
    let document: Observable<any> = this.documentsService.fetchCoverDocument();
    let user: Observable<any> = this.userService.fetchFireUser();

    forkJoin([testimonies, document, user]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.testimonies = reply[0];
        // console.log(this.testimonies);
        this.testimonies.filter((t: any) => { });
        this.dataSource = new MatTableDataSource(this.testimonies);

        this.document = reply[1];
        // console.log(this.document);

        this.user = reply[2];
        this.user['activityName'] = this.user['activities'][0]['value'];
        //console.log('user: ', this.user);
        this.user['activities'].filter((x: any) => { this.userActivities.push(x['value']); });
        if (this.userActivities.includes('moderator')) { this.isPrivate = true; }
      },
      complete: () => {
        this.isDataAvailable = true;
        // this.setDataSourceAttributes();
      }
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
        windowType: 'kill-testimony',
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  setDataSourceAttributes(): void {
    if (this.isDataAvailable) {
      this.dataSource.paginator = this.paginator;
    }
  }

  popCategorizePostsDialog(post: any) {
    const dialogRef = this.dialog.open<any>(CategorizePostComponent, {
      data: {
        post: post,
        document: this.document,
        type: 'testimony'
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.dataSource['data'] = this.dataSource['data'].filter((x: any) => {
          return x['_id'] != reply['data']['_id'];
        });
      }
    });
  }
}
