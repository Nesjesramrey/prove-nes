import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable } from 'rxjs';
import { SingleTestimonyDialogComponent } from '../components/single-testimony-dialog/single-testimony-dialog.component';
import { TestimonyService } from '../services/testimony.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.testimonials-page',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  public testimonies: any = null;
  public displayedColumns: string[] = ['author', 'title', 'date', 'menu'];
  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public testimonyService: TestimonyService,
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let testimonies: Observable<any> = this.testimonyService.fetchAllTestimonies();
    forkJoin([testimonies]).subscribe((reply: any) => {
      // console.log(reply);
      this.testimonies = reply[0];
      console.log(this.testimonies);

      this.dataSource = new MatTableDataSource(this.testimonies);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  attendComplaint(testimony: any) {
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

  popSingleComplaint(complaint_id: string) {
    console.log(complaint_id);
    window.open('/testimonios/' + complaint_id);
  }
}
