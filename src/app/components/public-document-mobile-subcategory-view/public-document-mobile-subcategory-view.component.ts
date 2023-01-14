import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { DescriptionViewerComponent } from '../description-viewer/description-viewer.component';

@Component({
  selector: '.public-document-mobile-subcategory-view',
  templateUrl: './public-document-mobile-subcategory-view.component.html',
  styleUrls: ['./public-document-mobile-subcategory-view.component.scss']
})
export class PublicDocumentMobileSubcategoryViewComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('isCollaborator') public isCollaborator: any = null;
  @Input('document') public document: any = null;
  public category: any = null;
  @Input('category') public subcategory: any = null;
  public topics: any[] = [];
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';

  constructor(
    public dialog: MatDialog,
    public utilityService: UtilityService,
    public activatedRoute: ActivatedRoute
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
  }

  ngOnInit(): void {
    this.topics = this.subcategory['topics'];
    let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID; });
    this.category = category[0];
  }

  openModalDescription() {
    const dialogRef = this.dialog.open<DescriptionViewerComponent>(
      DescriptionViewerComponent, {
      data: {
        document: this.document,
        layout: this.subcategory,
        title: this.subcategory['category']['name'],
        text: this.subcategory['description'],
        user: this.user,
        location: 'layout'
      },
      disableClose: true,
      panelClass: 'viewer-dialog',
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
