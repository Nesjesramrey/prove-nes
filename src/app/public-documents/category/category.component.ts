import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { SolutionService } from 'src/app/services/solution.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-category-page',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public document: any = null;
  public coverage: any[] = [];
  public coverageSelected: any = null;
  public isDataAvailable: boolean = false;
  public selectedCategory: any = null;
  public documentID: string = '';
  public categoryID: string = '';
  public image: string = '';
  public topicsCount: number = 0;
  public solutionsCount: number = 0;
  public topSolutions: any = [];
  public storedSolutions: any = [];
  public topSolutionsIds: any = [];
  public topLayouts: any = [];
  public selectedCategoryTitle: any = null;
  public titles: any = [];
  public stats: any = {};
  public layouts: any = null;
  @ViewChild('dataViewport') public dataViewport!: ElementRef;
  public allDocumentSolutions: any[] = [];
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public solutionService: SolutionService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    this.loadCategory();
    if (history['state']['coverage'] != undefined) {
      this.coverageSelected = history['state']['coverage'];
    };
  }

  loadCategory() {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });

    forkJoin([document, category]).subscribe((reply: any) => {
      this.titles = this.utilityService.formatTitles(reply[0].title, reply[1].category.name, '', '');
      this.document = reply[0];
      this.selectedCategory = reply[1];
      this.stats = this.selectedCategory.stats;
      this.image = reply[1].images.length > 0 ? reply[1].images[0] : this.image;
      this.topicsCount = reply[1].topics.length;
      this.coverage = this.document['coverage'];
      if (this.coverageSelected == null) { this.coverageSelected = this.coverage[0]['_id']; }
      this.layouts = this.selectedCategory['subLayouts'];
      this.layouts.filter((x: any) => {
        x['topics'].filter((t: any) => {
          t['solutions'].filter((s: any) => {
            s['url'] = '/documentos-publicos/' + this.document['_id'] +
              '/categoria/' + this.selectedCategory['_id'] +
              '/subcategoria/' + x['_id'] +
              '/tema/' + t['_id'] +
              '/solucion/' + s['_id'];
            this.allDocumentSolutions.push(s);
          });
        });
      });

      let solutions = this.allDocumentSolutions.filter((e: any) => {
        return this.topSolutionsIds.includes(e['_id']);
      }, this.topSolutionsIds);

      this.topSolutions = [];
      this.storedSolutions = solutions;
      this.storedSolutions.filter((x: any) => {
        x['coverage'].filter((c: any) => {
          if (c['_id'] == this.coverageSelected) { this.topSolutions.push(x); }
        });
      });

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 100);
    });

    this.getDataCharts();
  }

  getDataCharts() {
    this.solutionService.getTopSolutionsByLayout(this.categoryID).subscribe((resp) => {
      this.topSolutions = resp;
      this.topSolutions.filter((x: any) => {
        this.topSolutionsIds.push(x['_id']);
      });
    });

    this.layoutService.getTopSublayoutByLayout(this.categoryID).subscribe((resp) => {
      this.topLayouts = resp;
    });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(ImageViewerComponent, {
      width: '640px',
      data: {
        location: 'document',
        document: this.selectedCategory,
      },
      disableClose: true,
      panelClass: 'viewer-dialog',
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  onSelectCoverage(event: any) {
    this.coverageSelected = event['value'];
    this.topSolutions = [];
    this.storedSolutions.filter((x: any) => {
      x['coverage'].filter((c: any) => {
        if (c['_id'] == this.coverageSelected) { this.topSolutions.push(x); }
      });
    });
  }

  getLayoutData(layout: any) { this.dataViewport.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}
