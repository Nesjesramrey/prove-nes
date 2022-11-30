import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '.public-document-mobile-category-view',
  templateUrl: './public-document-mobile-category-view.component.html',
  styleUrls: ['./public-document-mobile-category-view.component.scss']
})
export class PublicDocumentMobileCategoryViewComponent implements OnInit {
  @Input('category') public category: any = null;

  constructor() { }

  ngOnInit(): void {
    console.log(this.category);
  }
}
