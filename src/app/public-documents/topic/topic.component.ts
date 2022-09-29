import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin, Observable } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { DocumentService } from 'src/app/services/document.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatDialog } from '@angular/material/dialog';
// import { ModalSolutionComponent } from '../components/modal-solution/modal-solution.component';
import { ModalTestimonyComponent } from '../components/modal-testimony/modal-testimony.component';
import { AddDocumentTestimonyComponent } from 'src/app/components/add-document-testimony/add-document-testimony.component';
import { AddDocumentSolutionComponent } from 'src/app/components/add-document-solution/add-document-solution.component';
import { VoteService } from 'src/app/services/vote.service';
import { ModalVotesComponent } from '../components/modal-votes/modal-votes.component';
import { ThisReceiver } from '@angular/compiler';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { AddDocumentCommentComponent } from 'src/app/components/add-document-comment/add-document-comment.component';
import { MatTableDataSource } from '@angular/material/table';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { FavoritesService } from 'src/app/services/favorites.service';
@Component({
  selector: '.topic-page',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public user: any = null;
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';
  public document: any = null;
  public category: any = null;
  public subcategory: any = null;
  public topic: any = null;
  public submitted: boolean = false;
  public votes: number = 0;
  public userVoted: number = 0;
  public image: string = '../../../assets/images/not_fount.jpg';
  public permission: any;
  public SolutionDataSource = new MatTableDataSource<any>();
  public favorites: boolean = false;
  public rank: any;
  public isFavorites: boolean = false;

  public testimonials: any = TESTIMONIALS;
  public solutionsData: any = [];
  public titles: any = [];
  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public topicService: TopicService,
    public voteService: VoteService,
    public UserService: UserService,
    public favoritesService: FavoritesService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
  }

  ngOnInit(): void {
    this.user = this.UserService.fetchFireUser().subscribe({
      error: (error: any) => {
        console.log(error);
      },
      next: (reply: any) => {
        this.user = reply;
        this.loadTopic();

        if (
          ['administrator', 'editor'].includes(this.user.activities?.[0]?.value)
        ) {
          this.permission = true;
        } else {
          this.permission = false;
        }
      },
    });
  }
  checkFavorites(favorites: any[]) {
    console.log({ favorites });
    if (favorites.some((item) => item.createdBy === this.user._id)) {
      console.log('aja');
      return true;
    }
    return false;
  }
  addFavorites() {
    this.favorites = true;
    let data = {
      topic: this.topicID,
      favorites: this.favorites,
    };
    this.favoritesService.addFavorites(data).subscribe((reply: any) => {
      if (reply.message == 'favorites add success') {
        this.isFavorites = true;
      }
    });
  }
  removeFavorites() {
    this.favorites = false;
    let data = {
      _id: this.user._id,
      topic: this.topicID,
      favorites: this.favorites,
    };
    console.log({ data });
    this.favoritesService.removeFavorites(data).subscribe((reply: any) => {
      console.log({ reply });
      if (reply.message == 'favorite update success') {
        this.isFavorites = false;
        console.log(' no es favorito');
      }
    });
  }

  loadTopic() {
    let document: Observable<any> =
      this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({
      _id: this.categoryID,
    });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById(
      { _id: this.subcategoryID }
    );
    let topic: Observable<any> = this.topicService.fetchSingleTopicById({
      _id: this.topicID,
    });

    let votes: Observable<any> = this.voteService.fetchVotesByTopicID({
      _id: this.topicID,
    });
    let favorites: Observable<any> =
      this.favoritesService.fetchFavoritesByTopicID({
        _id: this.topicID,
      });

    forkJoin([
      document,
      category,
      subcategory,
      topic,
      votes,
      favorites,
    ]).subscribe((reply: any) => {
      this.titles = this.utilityService.formatTitles(
        reply[0].title,
        reply[1].category.name,
        reply[2].category.name,
        reply[3].title
      );
      this.userVoted = this.checkUserVote(reply[4]);
      this.isFavorites = this.checkFavorites(reply[5].data);
      this.document = reply[0];
      this.category = reply[1];
      this.subcategory = reply[2];
      this.topic = reply[3];
      this.rank = this.topic.rank;
      this.votes = reply[4].length;
      this.solutionsData = this.topic.solutions;
      this.SolutionDataSource = new MatTableDataSource(this.solutionsData);

      this.getRamdomImage();
      setTimeout(() => {
        this.getBreadcrumbsTitles();
        this.isDataAvailable = true;
      }, 300);
    });
  }

  getRamdomImage() {
    let testimonials_withs_images = this.topic.testimonials.filter(
      (testimonial: any) => testimonial.images.length > 0
    );
    if (testimonials_withs_images.length > 0) {
      let index = Math.floor(Math.random() * testimonials_withs_images.length);
      this.image = testimonials_withs_images[index].images[0];
    } else {
      this.image = '';
    }
  }
  checkUserVote(votes: any[]) {
    console.log({ votes });
    return votes.find((vote) => vote.createdBy === this.user._id)?._id || 0;
  }

  openModalTestimony() {
    const dialogRef = this.dialog.open<AddDocumentTestimonyComponent>(
      AddDocumentTestimonyComponent,
      {
        width: '640px',
        maxHeight: '600px',
        data: {
          documentID: this.documentID,
          document: this.document,
          categoryID: this.categoryID,
          topicID: this.topicID,
          type: 'topic',
          image: this.image,
          firstname: this.user.firstname,
          lastname: this.user.lastname,
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.topic.testimonials.unshift(reply.testimonials[0]);
      }
    });
  }

  openModalSolution() {
    const dialogRef = this.dialog.open<AddDocumentSolutionComponent>(
      AddDocumentSolutionComponent,
      {
        width: '640px',
        data: {
          documentID: this.documentID,
          document: this.document,
          categoryID: this.categoryID,
          themeID: this.topicID,
          type: 'sublayout',
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        const solution = reply.solutions[0];
        this.solutionsData.unshift(solution);
        this.SolutionDataSource = new MatTableDataSource(this.solutionsData);
        // this.SolutionDataSource.setData(solution);
      }
    });
  }
  openModalVote() {
    const dialogRef = this.dialog.open<ModalVotesComponent>(
      ModalVotesComponent,
      {
        width: '500px',
        disableClose: true,
        data: { topic: this.topicID },
      }
    );
    dialogRef.afterClosed().subscribe((reply: any) => {
      this.loadTopic();
    });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(
      ImageViewerComponent,
      {
        width: '640px',
        data: {
          location: 'document',
          document: this.topic,
        },
        disableClose: true,
        panelClass: 'viewer-dialog',
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  openModalComment() {
    const dialogRef = this.dialog.open<AddDocumentCommentComponent>(
      AddDocumentCommentComponent,
      {
        width: '640px',
        data: {
          documentID: this.documentID,
          document: this.document,
          relationID: this.topicID,
          typeID: this.topicID,
          type: 'topic',
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  unVote() {
    this.voteService.deleteVote({ _id: this.userVoted }).subscribe({
      error: (error: any) => {
        console.log(error);
      },
      next: (reply: any) => {
        this.loadTopic();
      },
    });
  }

  getBreadcrumbsTitles() {
    this.topic.shortTitle = this.getshortTitle(this.topic.title);
  }

  getshortTitle(title: string) {
    const titleArr = title.split(' ');
    if (titleArr.length > 3) {
      return `${titleArr[0]} ${titleArr[1]} ${titleArr[2]} ${titleArr[3]}...`;
    }
    return title;
  }
}

export interface DataTable {
  title: string;
  ranking: number;
  users: number;
  score: number;
}

export interface ITestimony {
  title: string;
  description: string;
  created: string;
  avatarUrl: string;
  avatarUser: string;
}

const TESTIMONIALS: ITestimony[] = [
  {
    title: 'Testimonio 1',
    description: 'description',
    created: '01/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 2',
    description: 'description',
    created: '23/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 3',
    description: 'description',
    created: '10/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 4',
    description: 'description',
    created: '08/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 5',
    description: 'description',
    created: '05/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 6',
    description: 'description',
    created: '21/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 7',
    description: 'description',
    created: '22/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 8',
    description: 'description',
    created: '04/02/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
  {
    title: 'Testimonio 9',
    description: 'description',
    created: '01/03/2022',
    avatarUrl: 'books.png',
    avatarUser: '16393769364132.jpeg',
  },
];

const SOLUTIONS_DATA: DataTable[] = [
  {
    title:
      'Incorporar informales a través de cuotas únicas de ISR y Seguridad Social',
    ranking: 10,
    users: 255,
    score: 1.2,
  },
  {
    title: 'Tipificar la actividad económica ilegal como delito grave',
    ranking: 10,
    users: 255,
    score: 2,
  },
  { title: 'Crear padrón de informales', ranking: 10, users: 255, score: 3 },
  {
    title:
      'Publicar estudio de pérdidas económicas por actividad económica informal',
    ranking: 10,
    users: 255,
    score: 1.3,
  },
];
