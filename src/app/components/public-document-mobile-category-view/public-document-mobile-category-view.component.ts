import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { DescriptionViewerComponent } from '../description-viewer/description-viewer.component';

@Component({
  selector: '.public-document-mobile-category-view',
  templateUrl: './public-document-mobile-category-view.component.html',
  styleUrls: ['./public-document-mobile-category-view.component.scss']
})
export class PublicDocumentMobileCategoryViewComponent implements OnInit {
  @Input('document') public document: any = null;
  @Input('category') public category: any = null;
  @Input('topSolutions') public topSolutions: any = null;
  public layouts: any = null;
  public open: boolean = false;
  @ViewChild('states') public states!: any;

  constructor(
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.layouts = this.category['subLayouts'];
    // console.log(this.category);
  }

  getCoverageMenuStatus(data: any) {
    this.open = data['open'];
  }

  displayCoverageMenu() {
    this.open = !this.open;
  }

  openModalDescription() {
    const dialogRef = this.dialog.open<DescriptionViewerComponent>(
      DescriptionViewerComponent, {
      data: {
        title: this.category['category']['name'],
        text: this.category['description']
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
