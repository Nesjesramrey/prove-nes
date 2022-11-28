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
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { ViewDocumentCommentsComponent } from 'src/app/components/view-document-comments/view-document-comments.component';
import { EditTopicDataComponent } from 'src/app/components/edit-topic-data/edit-topic-data.component';

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
  public displayedColumns: string[] = ['title', 'ranking', 'users', 'interactions', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public solutionsList: Solution[] = _mockSolutions;
  public collaborators: any = null;
  public solutions: any[] = [];
  public sliderImages: string[] = [..._mockTheme.images];
  public actionControlActivityList: any[] = [];
  public accesibleLayouts: any[] = [];
  public userCoverageObj: any[] = [];
  public userCoverageStr: any[] = [];
  public topicCoverage: any = null;

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
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.themeID = this.activatedRoute['snapshot']['params']['themeID'];
    this.accessToken = this.authenticationService.fetchAccessToken;
  }

  ngOnInit(): void {
    this.actionControlActivityList = this.utilityService.actionControlActivityList;

    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID, });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID, });
    let topic: Observable<any> = this.topicService.fetchSingleTopicById({ _id: this.themeID });
    let user: Observable<any> = this.userService.fetchFireUser();
    let acl: Observable<any> = this.documentService.fetchAccessControlList({ document_id: this.documentID });

    forkJoin([document, category, subcategory, topic, user, acl]).subscribe((reply: any) => {
      this.document = reply[0];
      this.collaborators = this.document['collaborators'];
      this.collaborators = this.collaborators.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (t['user']['_id'] === value['user']['_id'])));
      this.category = reply[1];
      this.subcategory = reply[2];
      this.topics = this.subcategory['topics'];
      this.topic = reply[3];
      this.topicCoverage = this.document['coverage'].filter((x: any) => {
        return x['_id'] == this.topic['coverage'][0]
      });

      this.sliderImages = this.topic['images'];
      this.solutions = this.topic['solutions'];
      this.dataSource = new MatTableDataSource(this.solutions);
      this.user = reply[4];
      this.user['activityName'] = this.user['activities'][0]['value'];

      this.layouts = reply[5]['layouts'];
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
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.coverageSelected });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddDocumentSolutionComponent>(AddDocumentSolutionComponent, {
      // width: '640px',
      data: {
        themeID: this.themeID,
        coverage: coverage[0]
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.solutions.push(reply['solutions'][0]);
        this.dataSource = new MatTableDataSource(this.solutions);
      }
    });
  }

  popAddDocumentTestimony() {
    const dialogRef = this.dialog.open<AddDocumentTestimonyComponent>(AddDocumentTestimonyComponent, {
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

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(ImageViewerComponent, {
      width: '640px',
      data: {
        location: 'topic',
        document: this.document,
        topic: this.topic,
        user: this.user
      },
      disableClose: true,
      panelClass: 'viewer-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
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
        location: 'topic',
        document: this.document,
        topic: this.topic,
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
        location: 'topic',
        document: this.document,
        topic: this.topic,
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popEditTopicDialog() {
    const dialogRef = this.dialog.open<EditTopicDataComponent>(EditTopicDataComponent, {
      // width: '640px',
      data: {
        topic: this.topic,
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.topic['title'] = reply['title'];
        this.topic['description'] = reply['description'];
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
