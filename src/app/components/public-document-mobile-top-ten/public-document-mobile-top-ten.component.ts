import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.public-document-mobile-top-ten',
  templateUrl: './public-document-mobile-top-ten.component.html',
  styleUrls: ['./public-document-mobile-top-ten.component.scss']
})
export class PublicDocumentMobileTopTenComponent implements OnInit {
  @Input('solutions') public solutions: any = null;
  @Input('open') public open: boolean = false;
  @Output() public openMenu = new EventEmitter<any>();

  constructor(
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.solutions.filter((x: any) => {
      if (x['stats'] == null) { x['stats'] = { score: 0 } }
    });
    this.sortSolutions(this.solutions);
    this.solutions = this.solutions.slice(0, 10);
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  sortSolutions(data: any) {
    return data.sort((a: any, b: any) => {
      return b.stats.score - a.stats.score;
    });
  }

  displayCoverageMenu() {
    this.open = !this.open;
    this.openMenu.emit({ open: this.open });
  }
}
