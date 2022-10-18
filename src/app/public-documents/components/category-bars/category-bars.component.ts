import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.category-bars',
  templateUrl: './category-bars.component.html',
  styleUrls: ['./category-bars.component.scss']
})
export class CategoryBarsComponent implements OnInit {
  @Input('document_id') public document_id: string = '';
  @Input('layouts') public layouts: any[] = [];
  @Output() public sendLayoutData = new EventEmitter<any>();
  public layoutSelected: string = '';

  constructor(
    public utilityService: UtilityService,
    public router: Router
  ) { }

  ngOnInit(): void { }

  displayLayoutData(layout: any) {
    this.layoutSelected = layout['_id'];
    this.sendLayoutData.emit(layout);
  }

  linkMe(url: string) {
    this.router.navigateByUrl(url, { state: { coverage: 'coverage' } });
    // this.utilityService.linkMe(url);
  }
}
