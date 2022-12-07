import { ConstantPool } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.category-bars',
  templateUrl: './category-bars.component.html',
  styleUrls: ['./category-bars.component.scss'],
})
export class CategoryBarsComponent implements OnInit {
  @Input('document_id') public document_id: string = '';
  @Input('coverageSelected') public coverageSelected: any = null;
  @Input('collabolators') public collaborators: any[] = [];
  @Input('layouts') public layouts: any[] = [];
  @Output() public sendLayoutData = new EventEmitter<any>();
  @Output() public sendCollaboratorsData = new EventEmitter<any>();
  public layoutSelected: string = '';
  public layoutCollaborators: string = '';
  public stats: any = [];

  constructor(
    public utilityService: UtilityService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.layouts.filter((x: any) => {
      if (x['stats'] != null) {
        this.stats.push({ layout: x['_id'], score: x['stats']['score'] });
      } else {
        x['stats'] = { layout: x['_id'], score: 0 }
        this.stats.push({ layout: x['_id'], score: x['stats']['score'] });
      }
    });
    // console.log(this.layouts);
  }

  displayLayoutData(layout: any) {
    this.layoutSelected = layout['_id'];
    this.sendLayoutData.emit(layout);
  }

  displayCollaboratorsData(collaborators: any) {
    this.layoutCollaborators = collaborators['_id'];
    this.sendCollaboratorsData.emit(collaborators);
  }

  linkMe(url: string) {
    this.router.navigateByUrl(url, {
      state: { coverage: this.coverageSelected },
    });
  }
}
