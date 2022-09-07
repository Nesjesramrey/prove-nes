import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UtilityService } from 'src/app/services/utility.service';
import { Section } from 'src/app/public-documents/components/top10-list/top10-list.component';
import { ICategory } from '../subcategory/subcategory.component';

@Component({
  selector: '.selected-category-page',
  templateUrl: './selected-category.component.html',
  styleUrls: ['./selected-category.component.scss'],
})
export class SelectedCategoryComponent implements OnInit {
  public documentID: string = '';
  public token: any = null;
  public user: any = null;
  public payload: any = null;
  public document: any = null;
  public layout: any = [];
  public categories: any[] = _categories_mock;
  public categoriesDisplayedColumns: string[] = [
    'name',
    'users',
    'interactions',
    'solutions',
    'problems',
    'ranking',
    'actions',
  ];
  public isDataAvailable: boolean = false;
  public displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'activities',
    'menu',
  ];
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingRowId: string | null = null;
  public items: Section[] = [];
  public categoriesData = CATEGORIES;
  public colors: any = COLORS;
  @ViewChild('editRowName') editRowName!: ElementRef<HTMLInputElement>;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.token = this.authenticationService.fetchToken;
    this.items = [
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
    // console.log(this.documentID);
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
      });
    }
  }

  linkCategories(id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${id}`);
  }
}

const CATEGORIES: ICategory[] = [
  { name: 'Educación' },
  { name: 'Infraestuctura' },
  { name: 'Salud' },
];

const _categories_mock = [
  {
    name: 'deporte',
    id: 'uuid221a',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
  {
    name: 'derechos humanos',
    id: 'uuid221b',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
  {
    name: 'económico',
    id: 'uuid221c',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
];
const COLORS = {
  bg: '#FF6D00',
};
