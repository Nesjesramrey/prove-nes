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
@Component({
  selector: '.solution-page',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss'],
})
export class SolutionComponent implements OnInit {
  public user: any = null;
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';
  public solutionID: string = '';
  public submitted: boolean = false;
  public color: any;
  public userVoted: number = 0;

  public document: any = null;
  public solution: any = null;
  public category: any = null;
  public subcategory: any = null;
  public topic: any = null;
  public votes: number = 0;

  public testimonials: any = TESTIMONIALS;

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
    this.user = this.UserService.fetchFireUser().subscribe({
      error: (error: any) => {
        console.log(error);
      },
      next: (reply: any) => {
        this.user = reply;
        console.log({ user: this.user });
      },
    });
  }

  ngOnInit(): void {
    this.loadSolution();
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
      console.log('##', reply);
      this.userVoted = this.checkUserVote(reply[5]);
      this.document = reply[0];
      this.category = reply[1];
      this.subcategory = reply[2];
      this.topic = reply[3];
      this.solution = reply[4];
      this.votes = reply[5].length;
    });
  }

  checkUserVote(votes: any[]) {
    console.log({
      votes,
      find: votes.find((vote) => vote.createdBy === this.user._id),
    });
    return votes.find((vote) => vote.createdBy === this.user._id)?._id || 0;
  }

  openModalTestimony() {
    const dialogRef = this.dialog.open<AddDocumentTestimonyComponent>(
      AddDocumentTestimonyComponent,
      {
        width: '640px',
        data: {
          documentID: this.documentID,
          document: this.document,
          categoryID: this.categoryID,
          topicID: this.solutionID,
          type: 'solution',
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
        this.solution.testimonials.unshift(reply.testimonials[0]);
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
  unVote() {
    this.voteService.deleteVote({ _id: this.userVoted }).subscribe({
      error: (error: any) => {
        console.log(error);
      },
      next: (reply: any) => {
        this.loadSolution();
      },
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
