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

@Component({
  selector: '.topic-public-page',
  templateUrl: './topic-public.component.html',
  styleUrls: ['./topic-public.component.scss'],
})
export class TopicPublicComponent implements OnInit {
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
  // public displayedColumns: string[] = ['select', 'name', 'email', 'activities', 'menu'];
  // public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingRowId: string | null = null;
  // public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  public displayedColumns: string[] = ['name', 'ranking', 'users'];

  public dataSource = ELEMENT_DATA;

  public problemsDataSource = PROBLEMS_DATA;
  public solutionsDataSource = SOLUTIONS_DATA;

  public categoriesData = CATEGORIES;
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
        // this.user = reply[0]['user'];
      });
    }
  }

  linkCategories(id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${id}`);
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface DataTable {
  name: string;
  ranking: number;
  users: number;
}

export interface ICategory {
  name: string;
}

const CATEGORIES: ICategory[] = [
  { name: 'Educación' },
  { name: 'Infraestuctura' },
  { name: 'Salud' },
  { name: 'Empleo' },
  { name: 'Derechos humanos' },
  { name: 'Deporte' },
  { name: 'Vivienda' },
  { name: 'Subsidio familiar' },
  { name: 'Obesidad Infantil' },
  { name: 'Asaltos' },
  { name: 'Transporte' },
];

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
];

const SOLUTIONS_DATA: DataTable[] = [
  { name: 'Solución A', ranking: 10, users: 255 },
  { name: 'Solución A', ranking: 10, users: 255 },
  { name: 'Solución A', ranking: 10, users: 255 },
  { name: 'Solución A', ranking: 10, users: 255 },
];

const PROBLEMS_DATA: DataTable[] = [
  { name: 'Problema A', ranking: 10, users: 255 },
  { name: 'Problema A', ranking: 10, users: 255 },
  { name: 'Problema A', ranking: 10, users: 255 },
  { name: 'Problema A', ranking: 10, users: 255 },
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
