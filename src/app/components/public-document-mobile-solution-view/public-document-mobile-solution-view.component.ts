import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TestimonialListComponent } from '../testimonial-list/testimonial-list.component';

@Component({
  selector: '.public-document-mobile-solution-view',
  templateUrl: './public-document-mobile-solution-view.component.html',
  styleUrls: ['./public-document-mobile-solution-view.component.scss']
})
export class PublicDocumentMobileSolutionViewComponent implements OnInit {
  @Input('solution') public solution: any = null;
  @Input('user') public user: any = null;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // console.log(this.solution);
  }

  openTestimoniesDialog() {
    const dialogRef = this.dialog.open<any>(TestimonialListComponent, {
      data: {
        location: 'solution',
        solution: this.solution,
        topicID: this.solution['_id'],
        user: this.user
      },
      disableClose: true,
      panelClass: 'full-dialog',
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
