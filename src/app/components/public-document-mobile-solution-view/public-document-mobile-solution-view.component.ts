import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { TestimonialListComponent } from '../testimonial-list/testimonial-list.component';

@Component({
  selector: '.public-document-mobile-solution-view',
  templateUrl: './public-document-mobile-solution-view.component.html',
  styleUrls: ['./public-document-mobile-solution-view.component.scss']
})
export class PublicDocumentMobileSolutionViewComponent implements OnInit {
  @Input('document') public document: any = null;
  @Input('solution') public solution: any = null;
  @Input('user') public user: any = null;
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';
  public solutionID: string = '';
  public category: any = null;
  public subcategory: any = null;
  public topic: any = null;

  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public utilityservice: UtilityService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
    this.solutionID = this.activatedRoute['snapshot']['params']['solutionID'];
  }

  ngOnInit(): void {
    // console.log(this.solution);
    let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID });
    this.category = category[0];

    let subcategory = category[0]['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID; });
    this.subcategory = subcategory[0];

    let topic = subcategory[0]['topics'].filter((x: any) => { return x['_id'] == this.topicID; });
    this.topic = topic[0];
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

  linkMe(url: string) {
    this.utilityservice.linkMe(url);
  }
}
