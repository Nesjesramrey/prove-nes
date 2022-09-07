import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { Section } from 'src/app/public-documents/components/top10-list/top10-list.component';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-category-page',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public document: any = null;
  public isDataAvailable: boolean = false;

  public selectedCategory: any = null;
  public documentID: string = '';
  public categoryID: string = '';

  public items: Section[] = top10;

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public layoutService: LayoutService
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
      console.log(reply);
      this.document = reply[0];
      this.selectedCategory = reply[1];

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 300);
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
