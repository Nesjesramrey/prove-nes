import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'breadcrumbs-component',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class BreadcrumbsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
