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
import { TopicService } from 'src/app/services/topic.service';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { ViewDocumentCommentsComponent } from 'src/app/components/view-document-comments/view-document-comments.component';
import { EditSolutionDataComponent } from 'src/app/components/edit-solution-data/edit-solution-data.component';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';

@Component({
  selector: 'app-single-solution',
  templateUrl: './single-solution.component.html',
  styleUrls: ['./single-solution.component.scss'],
})
export class SingleSolutionComponent implements OnInit {
  public documentID: string = '';
  public accessToken: any = null;
  public categoryID: string = '';
  public subcategoryID: string = '';
  public themeID: string = '';
  public solutionID: string = '';
  public carouselContentSize: number = 150;
  public selectedCategory: any = null;
  public user: any = null;
  public document: any = null;
  public category: any = null;
  public subcategory: any = null;
  public topics: any = null;
  public topic: any = null;
  public solution: any = null;
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
  public actionControlActivityList: any[] = [];
  public accesibleLayouts: any[] = [];
  public userCoverageObj: any[] = [];
  public userCoverageStr: any[] = [];
  public coverageSelected: any = null;

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
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.themeID = this.activatedRoute['snapshot']['params']['themeID'];
    this.solutionID = this.activatedRoute['snapshot']['params']['solutionID'];
    this.accessToken = this.authenticationService.fetchAccessToken;
  }

  ngOnInit(): void {
    this.actionControlActivityList = this.utilityService.actionControlActivityList;

    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID, });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID, });
    let topic: Observable<any> = this.topicService.fetchSingleTopicById({ _id: this.themeID });
    let solution: Observable<any> = this.solutionService.fetchSingleSolutionById({ _id: this.solutionID });
    let user: Observable<any> = this.userService.fetchFireUser();
    let acl: Observable<any> = this.documentService.fetchAccessControlList({ document_id: this.documentID });

    forkJoin([document, category, subcategory, topic, solution, user, acl]).subscribe((reply: any) => {
      // console.log(reply);
      this.document = reply[0];
      // console.log('document: ', this.document);
      this.collaborators = this.document['collaborators'];
      this.collaborators = this.collaborators.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) =>
          (t['user']['_id'] === value['user']['_id']))
      );
      // console.log('collaborators: ', this.collaborators);
      this.category = reply[1];
      // console.log('category: ', this.category);
      this.subcategory = reply[2];
      // console.log('subcategory: ', this.subcategory);
      this.topics = this.subcategory['topics'];
      // console.log('topics: ', this.topics);
      this.topic = reply[3];
      // console.log('topic: ', this.topic);
      this.solution = reply[4];
      // console.log('solution: ', this.solution);
      this.sliderImages = this.solution['images'];
      this.user = reply[5];
      this.user['activityName'] = this.user['activities'][0]['value'];
      // console.log('user: ', this.user);
      this.layouts = reply[6]['layouts'];
      this.layouts.filter((x: any) => { x['states'].length == 0 ? x['access'] = false : x['access'] = true; });
      this.accesibleLayouts = this.layouts.filter((x: any) => { return x['states'].length != 0; });
      this.accesibleLayouts.filter((x: any) => {
        x['states'].filter((y: any) => { this.userCoverageObj.push(y); });
      });
      this.userCoverageObj.filter((x: any) => { this.userCoverageStr.push(x['id']); });
      this.document['coverage'].filter((x: any) => {
        x['enabled'] = false;
        if (this.userCoverageStr.includes(x['_id'])) { x['enabled'] = true; }
      });
      // console.log(this.layouts);

      switch (this.user['activityName']) {
        case 'editor':
          this.document['coverage'].filter((x: any) => { x['enabled'] = true; });
          break;
      }

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
    });
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

  onSelectCoverage(event: any) {
    this.coverageSelected = event['value'];
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

  linkSolution(id: string) {
    this.utilityService.linkMe(
      `documentos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/temas/${this.themeID}/solucion/${id}`
    );
  }

  popAddCommentsDialog() {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.coverageSelected });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddCommentsComponent>(AddCommentsComponent, {
      width: '640px',
      data: {
        location: 'solution',
        document: this.document,
        solution: this.solution,
        coverage: coverage[0]
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popDocumentComments() {
    const dialogRef = this.dialog.open<ViewDocumentCommentsComponent>(ViewDocumentCommentsComponent, {
      data: {
        location: 'solution',
        document: this.document,
        solution: this.solution,
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popEditSolutionDialog() {
    const dialogRef = this.dialog.open<EditSolutionDataComponent>(EditSolutionDataComponent, {
      width: '640px',
      data: {
        solution: this.solution,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
        this.solution['title'] = reply['title'];
        this.solution['description'] = reply['description'];
      }
    });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(ImageViewerComponent, {
      width: '640px',
      data: {
        location: 'solution',
        document: this.document,
        solution: this.solution,
        user: this.user
      },
      disableClose: true,
      panelClass: 'viewer-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
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
