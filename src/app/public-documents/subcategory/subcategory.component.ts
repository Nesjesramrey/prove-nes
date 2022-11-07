import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'src/app/services/layout.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { CustomMatDataSource } from '../custom-class/custom-table.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: '.subcategory-page',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public document: any = null;
  public category: any;
  public subCategoryTitle: any = null;
  public subcategory: any = null;
  public panelTopicsData: any = [];
  public isDataAvailable: boolean = false;
  public displayedColumns: string[] = ['title', 'score', 'users'];
  public TopicDataSource: any;
  public SolutionDataSource: any;
  public topicsDataSource: any = [];
  public solutionsDataSource: any = [];
  public image: string = '../../../assets/images/not_fount.jpg';
  public titles: any = [];
  public stats: any = {};
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  public coverage: any = null;
  public coverageSelected: any = null;
  public panelDataUpdated: Subject<any> = new Subject();

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public layoutService: LayoutService,
    public utilityService: UtilityService,
    public router: Router
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
  }

  ngOnInit(): void {
    if (history['state']['coverage'] != undefined) {
      this.coverageSelected = history['state']['coverage'];
    };
    this.loadSubcategory();
  }

  loadSubcategory() {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID });

    forkJoin([document, category, subcategory]).subscribe((reply: any) => {
      this.titles = this.utilityService.formatTitles(reply[0].title, reply[1].category.name, reply[2].category.name, '');

      this.document = reply[0];
      this.category = reply[1];
      this.subcategory = reply[2];
      this.stats = this.subcategory.stats;
      this.image = reply[1].images.length > 0 ? reply[1].images[0] : this.image;
      this.topicsDataSource = this.subcategory.topics;

      this.coverage = this.document['coverage'];
      if (this.coverageSelected == null) { this.coverageSelected = this.coverage[0]['_id']; }
      this.subcategory['topics'].filter((x: any) => {
        if (x['coverage'].includes(this.coverageSelected)) { this.panelTopicsData.push(x); }
      });

      const dataSolution: any = [];
      this.subcategory.topics.map((item: any) => [...item.solutions]).forEach((_: any, index: number) => {
        dataSolution.push(...this.subcategory.topics.map((item: any) => [...item.solutions])[index]);
      });
      dataSolution.filter((x: any) => {
        if (x['coverage'].includes(this.coverageSelected)) {
          this.solutionsDataSource.push(x);
        }
      });

      this.TopicDataSource = new CustomMatDataSource(this.topicsDataSource);
      this.SolutionDataSource = new CustomMatDataSource(this.solutionsDataSource);

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
    });
  }

  redirectSolution(id: string) {
    const topic = this.topicsDataSource.filter((item: any) =>
      item.solutions.filter((s: any) => (s._id === id ? item._id : ''))
    )[0];

    const path = `documentos-publicos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${topic._id}/solucion/${id}`;
    this.utilityService.linkMe(path);
  }

  redirect(id: string) {
    const path = `documentos-publicos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${id}`;
    // this.utilityService.linkMe(path);
    this.router.navigateByUrl(path, { state: { coverage: this.coverageSelected } });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(
      ImageViewerComponent,
      {
        width: '640px',
        data: {
          location: 'document',
          document: this.subcategory,
        },
        disableClose: true,
        panelClass: 'viewer-dialog',
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  applyFilterTopic(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.TopicDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSolution(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.SolutionDataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelectCoverage(event: any) {
    this.coverageSelected = event['value'];
    this.panelTopicsData = [];
    this.subcategory['topics'].filter((x: any) => {
      if (x['coverage'].includes(this.coverageSelected)) { this.panelTopicsData.push(x); }
    });
    this.panelDataUpdated.next(this.panelTopicsData);

    const dataSolution: any = [];
    this.subcategory.topics.map((item: any) => [...item.solutions]).forEach((_: any, index: number) => {
      dataSolution.push(...this.subcategory.topics.map((item: any) => [...item.solutions])[index]);
    });
    this.solutionsDataSource = [];
    dataSolution.filter((x: any) => {
      if (x['coverage'].includes(this.coverageSelected)) {
        this.solutionsDataSource.push(x);
      }
    });
    this.SolutionDataSource = new CustomMatDataSource(this.solutionsDataSource);
  }
}

export interface DataTable {
  name: string;
  ranking: number;
  users: number;
}

export interface ICategory {
  name: string;
}
