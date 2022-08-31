import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { DocumentService } from '../../services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { Observable, forkJoin } from 'rxjs';
import { AddDocumentThemeComponent } from '../../components/add-document-theme/add-document-theme.component';
import { AddDocumentSolutionComponent } from '../../components/add-document-solution/add-document-solution.component';
import { AddDocumentTestimonyComponent } from '../../components/add-document-testimony/add-document-testimony.component';

@Component({
  selector: 'app-single-theme',
  templateUrl: './single-theme.component.html',
  styleUrls: ['./single-theme.component.scss'],
})
export class SingleThemeComponent implements OnInit {
  public documentID: string = '';
  public accessToken: any = null;
  public categoryID: string = '';

  public user: any = null;
  public document: any = null;
  public layout: any = [];
  public isDataAvailable: boolean = false;
  public layouts: any[] = [];
  public themeData: Theme = _mockTheme;
  public imageToUpload: string[] = [];
  public states: any = [];
  public displayedColumns: string[] = [
    'title',
    'ranking',
    'users',
    'interactions',
  ];
  public solutionsList: Solution[] = _mockSolutions;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.accessToken = this.authenticationService.fetchAccessToken;
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
  }

  ngOnInit(): void {
    this.documentService
      .fetchSingleDocumentById({ _id: this.documentID })
      .subscribe((reply: any) => {
        this.document = reply;
        this.layouts = this.document['layouts'];
      });

    if (this.accessToken != null) {
      this.userService.fetchFireUser().subscribe({
        error: (error) => {
          switch (error['status']) {
            case 401:
              break;
          }
          setTimeout(() => {
            this.isDataAvailable = true;
          }, 1000);
        },
        next: (reply: any) => {
          this.user = reply;
          setTimeout(() => {
            this.isDataAvailable = true;
          }, 1000);
        },
        complete: () => {},
      });
    }

    let categories: Observable<any> = this.utilityService.fetchAllCategories();
    let states: Observable<any> = this.utilityService.fetchAllStatesMex();
    forkJoin([categories, states]).subscribe((reply: any) => {
      // console.log(reply);
      this.states = reply[1]['states'];
      // console.log(this.states);
    });
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const files = (event.target as HTMLInputElement)?.files ?? [];

    if (files?.length > 0) {
      Object.values(files).map((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.imageToUpload.push(reader.result as string);
        };

        reader.readAsDataURL(file);
      });
    }
  }

  popAddDocumentTheme() {
    const dialogRef = this.dialog.open<AddDocumentThemeComponent>(
      AddDocumentThemeComponent,
      {
        width: '640px',
        data: {
          documentID: this.documentID,
          document: this.document,
          categoryID: this.categoryID,
          type: 'sublayout',
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
      }
    });
  }

  popAddDocumentSolution() {
    const dialogRef = this.dialog.open<AddDocumentSolutionComponent>(
      AddDocumentSolutionComponent,
      {
        width: '640px',
        data: {
          documentID: this.documentID,
          document: this.document,
          categoryID: this.categoryID,
          type: 'sublayout',
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
      }
    });
  }

  popAddDocumentTestimony() {
    const dialogRef = this.dialog.open<AddDocumentTestimonyComponent>(
      AddDocumentTestimonyComponent,
      {
        width: '640px',
        data: {
          documentID: this.documentID,
          document: this.document,
          categoryID: this.categoryID,
          type: 'sublayout',
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
      }
    });
  }
}

interface Theme {
  title: string;
  description: string;
  images: string[];
}

const _mockTheme: Theme = {
  title: 'Tema principal',
  description: '',
  images: [],
};

interface Solution {
  id: string;
  title: string;
  ranking: number;
  users: number;
  interactions: number;
}

const _mockSolutions: Solution[] = [
  {
    id: 'sol-01',
    title: 'Deporte todos los días',
    ranking: 10,
    users: 200,
    interactions: 120,
  },
  {
    id: 'sol-02',
    title: 'Crear y personalizar ligas',
    ranking: 10,
    users: 200,
    interactions: 120,
  },
  {
    id: 'sol-03',
    title: 'Crear y personalizar ligas',
    ranking: 10,
    users: 200,
    interactions: 120,
  },
  {
    id: 'sol-04',
    title: 'Crear y personalizar ligas',
    ranking: 10,
    users: 200,
    interactions: 120,
  },
  {
    id: 'sol-05',
    title: 'Crear y personalizar ligas',
    ranking: 10,
    users: 200,
    interactions: 120,
  },
];
