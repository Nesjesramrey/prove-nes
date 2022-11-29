import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { SolutionService } from 'src/app/services/solution.service';
import { LayoutService } from 'src/app/services/layout.service';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public solutionService: SolutionService,
    public layoutService: LayoutService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    if (history.state.status != undefined) { window.location.reload(); };
    this.loadDocument();
  }

  loadDocument() {
    this.getDataCharts();
    this.documentService
      .fetchSingleDocumentById({ _id: this.documentID })
      .subscribe((reply: any) => {
        this.document = reply;
        this.coverage = this.document['coverage'];
        this.layouts = this.document['layouts'];
        this.collaborators = this.document['collaborators'];

        // console.log(this.document);
        if (this.coverageSelected == null) {
          this.coverageSelected = this.coverage[0]['_id'];
        }

        this.layouts.filter((x: any) => {
          x['subLayouts'].filter((y: any) => {
            y['topics'].filter((t: any) => {
              t['solutions'].filter((s: any) => {
                s['url'] =
                  '/documentos-publicos/' +
                  this.document['_id'] +
                  '/categoria/' +
                  x['_id'] +
                  '/subcategoria/' +
                  y['_id'] +
                  '/tema/' +
                  t['_id'] +
                  '/solucion/' +
                  s['_id'];
                this.allDocumentSolutions.push(s);
              });
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
            if (c['_id'] == this.coverageSelected) {
              this.topSolutions.push(x);
            }
          });
        });

        setTimeout(() => {
          this.isDataAvailable = true;
        }, 100);
      });
  }

  getDataCharts() {
    this.solutionService
      .getTopSolutionsByDocument(this.documentID)
      .subscribe((resp: any) => {
        this.topSolutions = resp;
        this.topSolutions.filter((x: any) => {
          this.topSolutionsIds.push(x['_id']);
        });
      });

    this.layoutService
      .getTopLayoutByDocument(this.documentID)
      .subscribe((resp: any) => {
        this.topLayouts = resp;
      });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(
      ImageViewerComponent,
      {
        width: '640px',
        data: {
          location: 'document',
          document: this.document,
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
  }

  getLayoutData(layout: any) {
    this.dataViewport.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}
