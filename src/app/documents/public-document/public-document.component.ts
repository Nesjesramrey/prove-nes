import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { Section } from 'src/app/components/top10-list/top10-list.component';

@Component({
  selector: '.public-document-page',
  templateUrl: './public-document.component.html',
  styleUrls: ['./public-document.component.scss'],
})
export class PublicDocumentComponent implements OnInit {
  public documentID: string = '';
  public document: any = null;
  public items: Section[] = ITEMS;

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService
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
      });
  }
}

const ITEMS = [
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
