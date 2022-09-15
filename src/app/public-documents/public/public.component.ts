import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { Section } from 'src/app/public-documents/components/top10-list/top10-list.component';

@Component({
  selector: '.public-page',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  public documentID: string = '';
  public document: any = null;
  public items: Section[] = ITEMS;
  public isDataAvailable: boolean = false;
  public image: string = '../../../assets/images/not_fount.jpg';

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
  }

  ngOnInit(): void {
    console.log({ route: this.activatedRoute });
    this.loadDocument();
  }

  loadDocument() {
    this.documentService
      .fetchSingleDocumentById({ _id: this.documentID })
      .subscribe((reply: any) => {
        this.document = reply;
        setTimeout(() => {
          this.isDataAvailable = true;
        }, 300);
        this.image = (reply.images.length > 0) ? reply.images[0] : this.image;
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
