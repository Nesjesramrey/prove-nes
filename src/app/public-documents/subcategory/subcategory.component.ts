import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'src/app/services/layout.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { CustomMatDataSource } from '../custom-class/custom-table.component';
import { MatSort } from '@angular/material/sort';
import { AddDocumentThemeComponent } from 'src/app/components/add-document-theme/add-document-theme.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from 'src/app/services/user.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { AddCommentsSheetComponent } from 'src/app/components/add-comments-sheet/add-comments-sheet.component';

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
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';
  public user: any = null;
  public isCollaborator: boolean = false;
  public userCount: number = 0;

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public layoutService: LayoutService,
    public utilityService: UtilityService,
    public router: Router,
    public deviceDetectorService: DeviceDetectorService,
    public userService: UserService,
    public matBottomSheet: MatBottomSheet
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    if (history['state']['coverage'] != undefined) { this.coverageSelected = history['state']['coverage']; };

    let user: Observable<any> = this.userService.fetchFireUser();
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let userCount: Observable<any> = this.userService.fetchUserCount();

    forkJoin([user, document, userCount]).subscribe((reply: any) => {
      this.user = reply[0];
      this.user['role'] = this.user['activities'][0]['value'];

      this.document = reply[1];
      this.coverage = this.document['coverage'];
      if (this.coverageSelected == null) {
        let coverageSelected = this.coverage.filter((x: any) => { return x['name'] == 'Nacional'; });
        this.coverageSelected = coverageSelected[0]['_id'] || this.coverage[0]['_id'];
      };

      let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID });
      this.category = category[0];

      let subcategory = this.category['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID });
      this.subcategory = subcategory[0];
      this.stats = this.subcategory['stats'];

      this.topicsDataSource = this.subcategory['topics'];
      this.subcategory['topics'].filter((x: any) => {
        x['coverage'].filter((y: any) => {
          if (y['_id'] == this.coverageSelected) { this.panelTopicsData.push(x); }
        });
      });

      const dataSolution: any = [];
      this.subcategory.topics.map((item: any) => [...item.solutions]).forEach((_: any, index: number) => {
        dataSolution.push(...this.subcategory.topics.map((item: any) => [...item.solutions])[index]);
      });
      dataSolution.filter((x: any) => {
        x['coverage'].filter((y: any) => {
          if (y['_id'] == this.coverageSelected) { this.solutionsDataSource.push(x); }
        });
      });

      this.TopicDataSource = new CustomMatDataSource(this.panelTopicsData);
      this.SolutionDataSource = new CustomMatDataSource(this.solutionsDataSource);

      switch (this.user['role']) {
        case 'administrator':
          this.isCollaborator = true;
          break;

        case 'editor':
          this.isCollaborator = true;
          break;

        case 'citizen':
          let collaborator: any = this.document['collaborators'].filter((x: any) => {
            return x['user']['_id'] == this.user['_id'];
          });
          if (collaborator.length != 0) { this.isCollaborator = true; }
          break;
      }

      this.userCount = reply[2]['total'];

      setTimeout(() => {
        this.isDataAvailable = true;
      });
    });

    // *** load document
    // this.documentService.fetchSingleDocumentById({ _id: this.documentID }).subscribe({
    //   error: (error: any) => { },
    //   next: (reply: any) => {
    //     this.document = reply;
    //     this.coverage = this.document['coverage'];
    //     if (this.coverageSelected == null) {
    //       let coverageSelected = this.coverage.filter((x: any) => { return x['name'] == 'Nacional'; });
    //       this.coverageSelected = coverageSelected[0]['_id'] || this.coverage[0]['_id'];
    //     };

    //     let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID });
    //     this.category = category[0];

    //     let subcategory = this.category['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID });
    //     this.subcategory = subcategory[0];
    //     this.stats = this.subcategory['stats'];

    //     this.topicsDataSource = this.subcategory['topics'];
    //     this.subcategory['topics'].filter((x: any) => {
    //       x['coverage'].filter((y: any) => {
    //         if (y['_id'] == this.coverageSelected) { this.panelTopicsData.push(x); }
    //       });
    //     });

    //     const dataSolution: any = [];
    //     this.subcategory.topics.map((item: any) => [...item.solutions]).forEach((_: any, index: number) => {
    //       dataSolution.push(...this.subcategory.topics.map((item: any) => [...item.solutions])[index]);
    //     });
    //     dataSolution.filter((x: any) => {
    //       x['coverage'].filter((y: any) => {
    //         if (y['_id'] == this.coverageSelected) { this.solutionsDataSource.push(x); }
    //       });
    //     });

    //     this.TopicDataSource = new CustomMatDataSource(this.panelTopicsData);
    //     this.SolutionDataSource = new CustomMatDataSource(this.solutionsDataSource);
    //   },
    //   complete: () => {
    //     this.isDataAvailable = true;
    //   }
    // });
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
      x['coverage'].filter((y: any) => {
        if (y['_id'] == this.coverageSelected) { this.panelTopicsData.push(x); }
      });
    });
    this.panelDataUpdated.next(this.panelTopicsData);
    this.TopicDataSource = new CustomMatDataSource(this.panelTopicsData);

    const dataSolution: any = [];
    this.subcategory.topics.map((item: any) => [...item.solutions]).forEach((_: any, index: number) => {
      dataSolution.push(...this.subcategory.topics.map((item: any) => [...item.solutions])[index]);
    });
    this.solutionsDataSource = [];
    dataSolution.filter((x: any) => {
      x['coverage'].filter((y: any) => {
        if (y['_id'] == this.coverageSelected) { this.solutionsDataSource.push(x); }
      });
    });
    this.SolutionDataSource = new CustomMatDataSource(this.solutionsDataSource);
  }

  popAddDocumentTheme() {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.coverageSelected });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddDocumentThemeComponent>(AddDocumentThemeComponent, {
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: this.subcategoryID,
        coverage: coverage[0]
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        if (reply.hasOwnProperty('topic')) {
          reply['topic']['solutions'] = reply['solutions'];
          // this.topics.push(reply['topic']);
        } else {
          this.panelTopicsData.push(reply);
        }
        this.TopicDataSource = new CustomMatDataSource(this.panelTopicsData);
      }
    });
  }

  getTopicStatus(event: any) {
    // console.log(event);
  }

  openBottomSheet(): void {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user
      },
      panelClass: 'desktop-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  handleComments() {
    const bottomSheetRef = this.matBottomSheet.open(AddCommentsSheetComponent, {
      data: {
        document: this.document,
        layout: this.subcategory,
        user: this.user,
        location: 'subLayout'
      },
      panelClass: 'desktop-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
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
