import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { SolutionService } from 'src/app/services/solution.service';
import { LayoutService } from 'src/app/services/layout.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from 'src/app/services/user.service';
import { forkJoin, Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { AddCommentsSheetComponent } from 'src/app/components/add-comments-sheet/add-comments-sheet.component';

@Component({
  selector: '.public-page',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  public documentID: string = '';
  public document: any = null;
  public topSolutions: any = [];
  public storedSolutions: any = [];
  public topSolutionsIds: any = [];
  public topLayouts: any = [];
  public isDataAvailable: boolean = false;
  public coverage: any[] = [];
  public coverageSelected: any = null;
  public layouts: any[] = [];
  public collaborators: any[] = [];
  @ViewChild('dataViewport') public dataViewport!: ElementRef;
  public allDocumentSolutions: any[] = [];
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';
  public user: any = null;
  public isCollaborator: boolean = false;
  public userCount: number = 0;

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public solutionService: SolutionService,
    public layoutService: LayoutService,
    public deviceDetectorService: DeviceDetectorService,
    public userService: UserService,
    public matBottomSheet: MatBottomSheet
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    if (history.state.status != undefined) { window.location.reload(); };

    let user: Observable<any> = this.userService.fetchFireUser();
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let userCount: Observable<any> = this.userService.fetchUserCount();

    forkJoin([user, document, userCount]).subscribe((reply: any) => {
      this.user = reply[0];
      this.user['role'] = this.user['activities'][0]['value'];

      this.document = reply[1];
      this.coverage = this.document['coverage'];
      this.layouts = this.document['layouts'];
      this.collaborators = this.document['collaborators'];

      if (this.coverageSelected == null) {
        let coverageSelected = this.coverage.filter((x: any) => { return x['name'] == 'Nacional'; });
        this.coverageSelected = coverageSelected[0]['_id'] || this.coverage[0]['_id'];
      };

      this.layouts.filter((x: any) => {
        x['subLayouts'].filter((y: any) => {
          y['topics'].filter((t: any) => {
            t['solutions'].filter((s: any) => {
              s['url'] = '/documentos-publicos/' + this.document['_id'] +
                '/categoria/' + x['_id'] +
                '/subcategoria/' + y['_id'] +
                '/tema/' + t['_id'] +
                '/solucion/' + s['_id'];
              this.allDocumentSolutions.push(s);
            });
          });
        });
      });

      this.layouts = this.layouts.filter((x: any) => { return x['isActive'] == true; });

      this.allDocumentSolutions.filter((x) => { this.topSolutionsIds.push(x['_id']); });
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
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(
      ImageViewerComponent, {
      width: '640px',
      data: {
        location: 'document',
        document: this.document,
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
        if (c['_id'] == this.coverageSelected) {
          this.topSolutions.push(x);
        }
      });
    });
    this.topSolutions = this.topSolutions.slice(0, 10);
    this.sortData();

  }

  getLayoutData(layout: any) {
    this.dataViewport.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
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
        user: this.user,
        location: 'document'
      },
      panelClass: 'desktop-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  sortData() {
    return this.topSolutions.sort((a: any, b: any) => {
      return <any>(b['stats']['score']) - <any>(a['stats']['score']);
    });
  }
}
