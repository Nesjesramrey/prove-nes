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
import { ChartData, ChartOptions } from 'chart.js';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';

@Component({
  selector: 'app-single-theme',
  templateUrl: './single-theme.component.html',
  styleUrls: ['./single-theme.component.scss'],
})
export class SingleThemeComponent implements OnInit {
  public documentID: string = '';
  public accessToken: any = null;
  public categoryID: string = '';
  public themeID: string = '';
  public carouselContentSize: number = 150;

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
  public collaborators: any = null;
  public solutions: any = null;

  // simplet doughnut
  public simpletDoughnutData: ChartData<'doughnut'> = _simpleDonuthData;

  // MULTI doughnut
  public data: ChartData<'doughnut'> = data;
  // MULTI doughnut
  public chartOptions: ChartOptions<'doughnut'> = {
    cutout: 98,
    plugins: {
      legend: { display: true, position: 'chartArea', align: "center" },
    },
    scales: {
      x: {
        display: false,
        ticks: { display: false },
      },
      y: {
        display: false,
        ticks: { display: false },
      },
    },
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService,
    public layoutService: LayoutService,
    public solutionService: SolutionService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.themeID = this.activatedRoute['snapshot']['params']['themeID'];
    this.accessToken = this.authenticationService.fetchAccessToken;
  }

  ngOnInit(): void {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    let solutions: Observable<any> = this.solutionService.fetchSingleSolutionById({ _id: this.themeID });
    let categories: Observable<any> = this.utilityService.fetchAllCategories();
    let states: Observable<any> = this.utilityService.fetchAllStatesMex();
    forkJoin([categories, states, document, solutions]).subscribe((reply: any) => {
      console.log(reply);
      this.states = reply[1]['states'];
      this.collaborators = reply[2].collaborators;
      this.solutions = reply[3];
      console.log(this.solutions);
    });    
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



    this.calculateCarouselContentSize();
  }

  calculateCarouselContentSize() {
    const newVal =
      (this.themeData.images.length + this.imageToUpload.length) * 150;
    this.carouselContentSize = (newVal || 150) + 150;
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const files = (event.target as HTMLInputElement)?.files ?? [];

    if (files?.length > 0) {
      Object.values(files).map((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.imageToUpload.unshift(reader.result as string);
        };

        reader.readAsDataURL(file);
      });
    }

    setTimeout(() => {
      this.calculateCarouselContentSize();
    }, 300);
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

// simplet doughnut
const _simpleDonuthData: ChartData<'doughnut'> = {
  labels: ['75%'],
  datasets: [
    {
      label: 'Dato',
      data: [80, 30],
      backgroundColor: ['#20C588', '#E1F2EC'],
      hoverBackgroundColor: ['#20C588', '#E1F2EC'],
      borderRadius: 10,
      borderWidth: 2,
      hoverBorderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderColor: '#ffffff',
    },
  ],
};

// MULTI doughnut
const commontStyles = {
  borderRadius: 10,
  borderWidth: 7,
  hoverBorderWidth: 7,
  borderColor: '#ffffff',
  hoverBorderColor: '#ffffff',
  // hoverOffset: 10,
  // borderAlign: 'center',
};
// MULTI doughnut
const data: ChartData<'doughnut'> = {
  labels: ['One', 'Two', 'Three'],
  datasets: [
    {
      label: 'My First Datase',
      data: [80, 30],
      backgroundColor: ['#20C588', '#f3f3f3'],
      hoverBackgroundColor: ['#20C588', '#f3f3f3'],

      // offset: 10,
      ...commontStyles,
    },
    {
      label: 'My Second Datase',
      data: [60, 40],
      backgroundColor: ['#306EFF', '#f3f3f3'],
      hoverBackgroundColor: ['#306EFF', '#f3f3f3'],
      ...commontStyles,
    },
    {
      label: '',
      data: [73, 27],
      backgroundColor: ['#FFCF03', '#f3f3f3'],
      hoverBackgroundColor: ['#FFCF03', '#f3f3f3'],
      ...commontStyles,
    },
  ],
};

interface Theme {
  title: string;
  description: string;
  images: string[];
}

const _mockTheme: Theme = {
  title: 'Tema principal',
  description: '',
  images: [
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  ],
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
