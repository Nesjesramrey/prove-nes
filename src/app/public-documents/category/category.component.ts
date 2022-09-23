import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { Section } from 'src/app/public-documents/components/top10-list/top10-list.component';
import { LayoutService } from 'src/app/services/layout.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-category-page',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public document: any = null;
  public coverage: any[] = [];
  public isDataAvailable: boolean = false;

  public selectedCategory: any = null;
  public documentID: string = '';
  public categoryID: string = '';
  public image: string = '';

  public topicsCount: number = 0;
  public solutionsCount: number = 0;
  public items: Section[] = top10;
  public selectedCategoryTitle: any = null;
  public titles : any = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory() {
    let document: Observable<any> =
      this.documentService.fetchSingleDocumentById({ _id: this.documentID });

    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({
      _id: this.categoryID,
    });

    forkJoin([document, category]).subscribe((reply: any) => {
      this.titles = this.utilityService.formatTitles
      (reply[0].title , reply[1].category.name , '' , '');
      this.document = reply[0];
      this.selectedCategory = reply[1];
      this.image = reply[1].images.length > 0 ? reply[1].images[0] : this.image;
      this.topicsCount = reply[1].topics.length;
      this.coverage = this.document.coverage;
      setTimeout(() => {
        this.isDataAvailable = true;
      }, 300);
    });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(
      ImageViewerComponent,
      {
        width: '640px',
        data: {
          location: 'document',
          document: this.selectedCategory,
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

const top10 = [
  {
    name: 'Construir escuelas en 2 años',
    value: 88,
  },
  {
    name: 'Construir 1000km de ancho de banda',
    value: 50,
  },
  {
    name: 'Estrategia de Combate al narcotrafico',
    value: 50,
  },
  {
    name: 'Camaras con IA en transporte',
    value: 50,
  },
  {
    name: 'Transporte publico gratis para estudiantes',
    value: 50,
  },
  {
    name: 'Subsidio a la familia por educacion',
    value: 50,
  },
];
