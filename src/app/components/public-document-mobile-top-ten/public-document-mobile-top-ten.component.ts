import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.public-document-mobile-top-ten',
  templateUrl: './public-document-mobile-top-ten.component.html',
  styleUrls: ['./public-document-mobile-top-ten.component.scss']
})
export class PublicDocumentMobileTopTenComponent implements OnInit {
  @Input('solutions') public solutions: any = null;

  constructor(
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    // console.log(this.solutions);
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
