import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.public-document-mobile-subcategory-bars',
  templateUrl: './public-document-mobile-subcategory-bars.component.html',
  styleUrls: ['./public-document-mobile-subcategory-bars.component.scss']
})
export class PublicDocumentMobileSubcategoryBarsComponent implements OnInit {
  @Input('document') public document: any = null;
  @Input('document_id') public document_id: string = '';
  @Input('category_id') public category_id: string = '';
  @Input('coverageSelected') public coverageSelected: any = null;
  @Input('layouts') public layouts: any[] = [];
  @Output() public sendLayoutData = new EventEmitter<any>();
  public layoutSelected: string = '';
  public stats: any = [];
  @Input('open') public open: boolean = false;
  @Output() public openMenu = new EventEmitter<any>();

  constructor(
    public utilityService: UtilityService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.layouts.filter((x: any) => {
      if (x['stats'] != null) {
        this.stats.push({ layout: x['_id'], score: x['stats']['score'] });
      } else {
        x['stats'] = [];
        this.stats.push({ layout: x['_id'], score: 0 });
      }
    });
    // console.log(this.layouts);
  }

  displayLayoutData(layout: any) {
    this.layoutSelected = layout['_id'];
    this.sendLayoutData.emit(layout);
  }

  linkMe(url: string) {
    this.router.navigateByUrl(url, { state: { coverage: this.coverageSelected } });
  }

  displayCoverageMenu() {
    this.open = !this.open;
    this.openMenu.emit({ open: this.open });
  }
}
