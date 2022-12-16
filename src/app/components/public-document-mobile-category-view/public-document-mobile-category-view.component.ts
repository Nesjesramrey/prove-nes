import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.layouts = this.category['subLayouts'];
  }

  getCoverageMenuStatus(data: any) {
    this.open = data['open'];
  }

  displayCoverageMenu() {
    this.open = !this.open;
  }
}
