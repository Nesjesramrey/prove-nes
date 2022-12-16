import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { TestimonialListComponent } from '../testimonial-list/testimonial-list.component';

@Component({
  selector: '.public-document-mobile-topic-view',
  templateUrl: './public-document-mobile-topic-view.component.html',
  styleUrls: ['./public-document-mobile-topic-view.component.scss']
})
export class PublicDocumentMobileTopicViewComponent implements OnInit {
  @Input('topic') public topic: any = null;
  @Input('user') public user: any = null;
  public solutions: any[] = [];
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    public utilityservice: UtilityService,
    public dialog: MatDialog
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
  }

  ngOnInit(): void {
    this.solutions = this.topic['solutions'];
  }

  linkMe(solutionID: string) {
    this.utilityservice.linkMe(
      '/documentos-publicos/' + this.documentID +
      '/categoria/' + this.categoryID +
      '/subcategoria/' + this.subcategoryID +
      '/tema/' + this.topicID +
      '/solucion/' + solutionID
    );
  }

  openTestimoniesDialog() {
    const dialogRef = this.dialog.open<any>(TestimonialListComponent, {
      data: {
        location: 'topic',
        topic: this.topic,
        topicID: this.topic['_id']
      },
      disableClose: true,
      panelClass: 'full-dialog',
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
