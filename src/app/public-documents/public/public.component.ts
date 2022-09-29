import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { Section } from 'src/app/public-documents/components/top10-list/top10-list.component';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SolutionService } from 'src/app/services/solution.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: '.public-page',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  public documentID: string = '';
  public document: any = null;
  public topSolutions: any = [];
  public topLayouts: any = [];
  public isDataAvailable: boolean = false;
  public image: string = '../../../assets/images/not_fount.jpg';
  public coverage: any[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public solutionService: SolutionService,
    public layoutService: LayoutService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
  }

  ngOnInit(): void {
    this.loadDocument();
  }

  loadDocument() {
    this.documentService
      .fetchSingleDocumentById({ _id: this.documentID })
      .subscribe((reply: any) => {
        this.document = reply;
        this.coverage = this.document.coverage;
        setTimeout(() => {
          this.isDataAvailable = true;
        }, 300);
        this.image = reply.images.length > 0 ? reply.images[0] : this.image;
      });
    this.getDataCharts();
  }

  getDataCharts() {
    this.solutionService
      .getTopSolutionsByDocument(this.documentID)
      .subscribe((resp) => {
        this.topSolutions = resp;
      });
    this.layoutService
      .getTopLayoutByDocument(this.documentID)
      .subscribe((resp) => {
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
}
