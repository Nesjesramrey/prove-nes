import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.public-document-mobile-category-bars',
  templateUrl: './public-document-mobile-category-bars.component.html',
  styleUrls: ['./public-document-mobile-category-bars.component.scss']
})
export class PublicDocumentMobileCategoryBarsComponent implements OnInit {
  @Input('document') public document: any = '';
  @Input('document_id') public document_id: string = '';
  @Input('coverageSelected') public coverageSelected: any = null;
  @Input('collabolators') public collaborators: any[] = [];
  @Input('layouts') public layouts: any[] = [];
  @Output() public sendLayoutData = new EventEmitter<any>();
  @Output() public sendCollaboratorsData = new EventEmitter<any>();
  public layoutSelected: string = '';
  public layoutCollaborators: string = '';
  public stats: any = [];
  @Input('open') public open: boolean = false;
  @Output() public openMenu = new EventEmitter<any>();

  constructor(
    public utilityService: UtilityService,
    public router: Router
  ) { }

  ngOnInit(): void { }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  displayCoverageMenu() {
    this.open = !this.open;
    this.openMenu.emit({ open: this.open });
  }
}
