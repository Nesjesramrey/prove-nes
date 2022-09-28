import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AddDocumentTestimonyComponent } from 'src/app/components/add-document-testimony/add-document-testimony.component';
import { DocumentService } from 'src/app/services/document.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';
import { VoteService } from 'src/app/services/vote.service';
import { ModalVotesComponent } from '../components/modal-votes/modal-votes.component';
import { UserService } from 'src/app/services/user.service';
import { AddDocumentCommentComponent } from 'src/app/components/add-document-comment/add-document-comment.component';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
@Component({
  selector: '.solution-page',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss'],
})
export class SolutionComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public user: any = null;
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';
  public solutionID: string = '';
  public submitted: boolean = false;
  public color: any;
  public userVoted: number = 0;
  public favorites: boolean = false;

  public document: any = null;
  public solution: any = null;
  public category: any = null;
  public subcategory: any = null;
  public topic: any = null;
  public votes: number = 0;
  public image: string = '../../../assets/images/not_fount.jpg';

  public testimonials: any = TESTIMONIALS;
  public titles: any = [];

  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public topicService: TopicService,
    public solutionService: SolutionService,
    public voteService: VoteService,
    public UserService: UserService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
    this.solutionID = this.activatedRoute['snapshot']['params']['solutionID'];
  }

  ngOnInit(): void {
    this.user = this.UserService.fetchFireUser().subscribe({
      error: (error: any) => {},
      next: (reply: any) => {
        this.user = reply;
        this.loadSolution();
      },
    });
  }
  chekFavorites() {
    this.favorites = !this.favorites;
    let data = {
      id: this.topicID,
      favorites: this.favorites,
    };
    console.log({ data });
  }

  loadSolution() {
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
    let solution: Observable<any> =
      this.solutionService.fetchSingleSolutionById({ _id: this.solutionID });

    let votes: Observable<any> = this.voteService.fetchVotesBySolutionID({
      _id: this.solutionID,
    });

    forkJoin([
      document,
      category,
      subcategory,
      topic,
      solution,
      votes,
    ]).subscribe((reply: any) => {
      this.userVoted = this.checkUserVote(reply[5]);
      this.document = reply[0];
      this.category = reply[1];
      this.subcategory = reply[2];
      this.topic = reply[3];
      this.solution = reply[4];
      this.votes = reply[5].length;
      this.image = reply[3].images.length > 0 ? reply[3].images[0] : this.image;

      setTimeout(() => {
        this.getBreadcrumbsTitles();
        this.isDataAvailable = true;
      }, 300);
    });
  }

  checkUserVote(votes: any[]) {
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
          topicID: this.solutionID,
          type: 'solution',
          image: this.image,
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.solution.testimonials.unshift(reply.testimonials[0]);
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
          categoryID: this.categoryID,
          relationID: this.solutionID,
          type: 'solution',
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  openModalVote() {
    const dialogRef = this.dialog.open<ModalVotesComponent>(
      ModalVotesComponent,
      {
        width: '500px',
        disableClose: true,
        data: { solution: this.solutionID },
      }
    );
    dialogRef.afterClosed().subscribe((reply: any) => {
      this.loadSolution();
    });
  }
  // unVote() {
  //   this.voteService.deleteVote({ _id: this.userVoted }).subscribe({
  //     error: (error: any) => {
  //       console.log(error);
  //     },
  //     next: (reply: any) => {
  //       this.loadSolution();
  //     },
  //   });
  // }

  getBreadcrumbsTitles() {
    this.topic.shortTitle = this.getshortTitle(this.topic.title);
    this.solution.shortTitle = this.getshortTitle(this.solution.title);
  }

  getshortTitle(title: string) {
    const titleArr = title.split(' ');
    if (titleArr.length > 4) {
      return `${titleArr[0]} ${titleArr[1]} ${titleArr[2]} ${titleArr[3]}...`;
    }
    return title;
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
