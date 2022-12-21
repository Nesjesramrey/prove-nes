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
  @Input('document') public document: any = null;
  public category: any = null;
  public subcategory: any = null;
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
    let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID });
    this.category = category[0];
    let subcategory = category[0]['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID; });
    this.subcategory = subcategory[0];
    this.solutions = this.topic['solutions'];
  }

  linkMe(url: string) {
    this.utilityservice.linkMe(url);
  }

  openTestimoniesDialog() {
    const dialogRef = this.dialog.open<any>(TestimonialListComponent, {
      data: {
        location: 'topic',
        topic: this.topic,
        topicID: this.topic['_id'],
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
