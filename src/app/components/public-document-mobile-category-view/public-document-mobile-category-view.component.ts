import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
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
  @Input('storedSolutions') public storedSolutions: any = null;

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

  onCoverageSelected(option: MatListOption[]) {
    let selection: any = [];
    let coverage: any = [];
    option.filter((x: any) => { selection.push(x['value']); });
    coverage = this.document['coverage'].filter((x: any) => { return selection.includes(x['_id']); });
  }

  onFilterSolutions() {
    let ids: any[] = [];
    this.states['selectedOptions']['selected'].filter((x: any) => { ids.push(x['value']); });

    this.topSolutions = [];
    this.storedSolutions.filter((x: any) => {
      x['coverage'].filter((c: any) => {
        if (ids.includes(c['_id'])) { this.topSolutions.push(x); }
      });
    });
    this.displayCoverageMenu();
  }
}
