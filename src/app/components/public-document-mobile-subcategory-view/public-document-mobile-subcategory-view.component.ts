import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '.public-document-mobile-subcategory-view',
  templateUrl: './public-document-mobile-subcategory-view.component.html',
  styleUrls: ['./public-document-mobile-subcategory-view.component.scss']
})
export class PublicDocumentMobileSubcategoryViewComponent implements OnInit {
  @Input('document') public document: any = null;
  @Input('category') public category: any = null;
  public topics: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.topics = this.category['topics'];
  }
}
