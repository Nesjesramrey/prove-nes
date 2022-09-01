import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { Section } from 'src/app/components/top10-list/top10-list.component';
import { ICategory } from '../subcategory-document/subcategory-document.component';

@Component({
  selector: '.public-document-page',
  templateUrl: './public-document.component.html',
  styleUrls: ['./public-document.component.scss'],
})
export class PublicDocumentComponent implements OnInit {
  public documentID: string = '';
  public token: any = null;
  public user: any = null;
  public payload: any = null;
  public document: any = null;
  public layout: any = [];

  public items: Section[] = ITEMS;
  public categoriesData = CATEGORIES;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService,
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.token = this.authenticationService.fetchToken;
  }

  ngOnInit(): void {
    // user available
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));
      let user: Observable<any> = this.userService.fetchUserById({
        _id: this.payload['sub'],
      });
      user.subscribe((reply: any) => {
        console.log({ reply });
        // this.user = reply[0]['user'];
      });
    }
    this.loadDocument();
  }

  loadDocument() {
    this.documentService
      .fetchSingleDocumentById({ _id: this.documentID })
      .subscribe((reply: any) => {
        this.document = reply;
        console.log(reply);
      });
  }
}

const CATEGORIES: ICategory[] = [
  { name: 'Educación' },
  { name: 'Infraestuctura' },
  { name: 'Salud' },
];

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
