import { Component, OnInit } from '@angular/core';

@Component({
  selector: '.public-document-mobile-fixed-tools',
  templateUrl: './public-document-mobile-fixed-tools.component.html',
  styleUrls: ['./public-document-mobile-fixed-tools.component.scss']
})
export class PublicDocumentMobileFixedToolsComponent implements OnInit {
  public open: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  displayMenu() {
    this.open = !this.open;
  }
}
