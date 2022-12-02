import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatList, MatListOption } from '@angular/material/list';

@Component({
  selector: '.public-document-mobile-view',
  templateUrl: './public-document-mobile-view.component.html',
  styleUrls: ['./public-document-mobile-view.component.scss']
})
export class PublicDocumentMobileViewComponent implements OnInit {
  @Input('document') public document: any = null;
  @Input('topSolutions') public topSolutions: any = null;
  public open: boolean = false;
  @ViewChild('states') public states!: any;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.topSolutions);
  }

  getCoverageMenuStatus(data: any) {
    this.open = data['open'];
  }

  displayCoverageMenu() {
    this.open = !this.open;
    this.states['selectedOptions']['selected'].filter((x: any) => { x['value'] = ''; });
  }

  onCoverageSelected(option: MatListOption[]) {
    let selection: any = [];
    let coverage: any = [];
    option.filter((x: any) => { selection.push(x['value']); });
    coverage = this.document['coverage'].filter((x: any) => { return selection.includes(x['_id']); });
  }
}
