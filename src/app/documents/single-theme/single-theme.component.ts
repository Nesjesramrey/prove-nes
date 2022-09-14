import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { DocumentService } from '../../services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { Observable, forkJoin, ConnectableObservable } from 'rxjs';
import { AddDocumentThemeComponent } from '../../components/add-document-theme/add-document-theme.component';
import { AddDocumentSolutionComponent } from '../../components/add-document-solution/add-document-solution.component';
import { AddDocumentTestimonyComponent } from '../../components/add-document-testimony/add-document-testimony.component';
import { ChartData, ChartOptions } from 'chart.js';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-single-theme',
  templateUrl: './single-theme.component.html',
  styleUrls: ['./single-theme.component.scss'],
})
export class SingleThemeComponent implements OnInit {
  public documentID: string = '';
  public accessToken: any = null;
  public categoryID: string = '';
  public subcategoryID: string = '';
  public themeID: string = '';
  public carouselContentSize: number = 150;
  public selectedCategory: any = null;
  public user: any = null;
  public document: any = null;
  public category: any = null;
  public subcategory: any = null;
  public topics: any = null;
  public topic: any = null;
  public layout: any = [];
  public isDataAvailable: boolean = false;
  public layouts: any[] = [];
  public themeData: Theme = _mockTheme;
  public imagesToUpload: string[] = [];
  public states: any = [];
  public displayedColumns: string[] = [
    'title',
    'ranking',
    'users',
    'interactions',
  ];
  public dataSource = new MatTableDataSource<any>();
  public solutionsList: Solution[] = _mockSolutions;
  public collaborators: any = null;
  public solutions: any[] = [];
  public sliderImages: string[] = [..._mockTheme.images];

  // simplet doughnut
  public simpletDoughnutData: ChartData<'doughnut'> = _simpleDonuthData;

  // MULTI doughnut
  public data: ChartData<'doughnut'> = data;
  // MULTI doughnut
  public chartOptions: ChartOptions<'doughnut'> = {
    cutout: 98,
    plugins: {
      legend: { display: false, position: 'chartArea', align: 'center' },
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
    public solutionService: SolutionService,
    public topicService: TopicService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.themeID = this.activatedRoute['snapshot']['params']['themeID'];
    this.accessToken = this.authenticationService.fetchAccessToken;
  }

  ngOnInit(): void {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID, });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID, });
    let topic: Observable<any> = this.topicService.fetchSingleTopicById({ _id: this.themeID });

    //forkJoin([categories, document, solutions, category, subcategory]).subscribe((reply: any) => {
    forkJoin([document, category, subcategory, topic]).subscribe((reply: any) => {
      // console.log(reply);
      this.document = reply[0];
      // console.log(this.document);
      this.layouts = this.document['layouts'];
      this.collaborators = reply[0].collaborators;
      this.category = reply[1];
      // console.log("categoria " + JSON.stringify(this.category));
      this.subcategory = reply[2];
      // console.log("subcategoria " + JSON.stringify(this.subcategory));
      this.topics = this.subcategory['topics'];
      // console.log(this.topics);
      this.topic = reply[3];
      // console.log(this.topic);
      // console.log("topic " + JSON.stringify(this.topic));
      this.sliderImages = this.topic.images;
      this.solutions = this.topic['solutions'];
      this.dataSource = new MatTableDataSource(this.solutions);

      // let sols = this.topic.solutions;
      // for (let j = 0; j < sols.length; j++) {
      //   let sol: Observable<any> = this.solutionService.fetchSingleSolutionById({ _id: this.topic.solutions[j] });
      //   forkJoin([sol]).subscribe((reply: any) => {
      //     this.solutions.push(reply[0]);
      //   })
      // }
    });
    // this.documentService
    //   .fetchSingleDocumentById({ _id: this.documentID })
    //   .subscribe((reply: any) => {
    //     this.document = reply;
    //     this.layouts = this.document['layouts'];
    //   });

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
        complete: () => { },
      });
    }
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const files = (event.target as HTMLInputElement)?.files ?? [];

    if (files?.length > 0) {
      Object.values(files).map((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.imagesToUpload.unshift(reader.result as string);
        };

        reader.readAsDataURL(file);
      });

      this.sliderImages = [...this.imagesToUpload, ...this.sliderImages];
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
          themeID: this.themeID,
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.solutions.push(reply['solutions'][0]);
        this.dataSource = new MatTableDataSource(this.solutions);
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
          topicID: this.themeID,
          type: 'topic',
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

  linkSolution(id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/temas/${this.themeID}/solucion/${id}`)
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
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nisi luctus, pulvinar magna vel, iaculis magna. Etiam nec sodales est. Praesent auctor vel metus ac ultricies. Morbi vel nisl vel lectus blandit fermentum eget ut nisi. Duis euismod turpis quis molestie ultricies. Pellentesque ut lacus sit amet turpis iaculis pulvinar. Sed lobortis pulvinar euismod. Praesent ut dui id eros aliquet varius. Etiam imperdiet vestibulum sem, non pulvinar magna bibendum eget. Sed finibus ornare volutpat. Praesent efficitur dignissim tempus. Morbi et aliquam velit. Nunc sit amet pretium dui, et venenatis mauris.',
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
