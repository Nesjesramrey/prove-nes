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
@Component({
  selector: '.topic-page',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
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
  public color: any = 'primary';
  public votes: number = 0;

  public testimonials: any = TESTIMONIALS;
  public solutionsData: any = [];
  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public topicService: TopicService,
    public voteService: VoteService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];

    console.log(this.topicID);
  }

  ngOnInit(): void {
    this.loadTopic();
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

    forkJoin([document, category, subcategory, topic, votes]).subscribe(
      (reply: any) => {
        console.log('##', reply);
        this.document = reply[0];
        this.category = reply[1];
        this.subcategory = reply[2];
        this.topic = reply[3];
        this.votes = reply[4].length;
        this.solutionsData = this.topic.solutions;
      }
    );
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
      this.loadTopic();
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
      if (reply != undefined) {
        this.color = reply;
      }
    });
  }
  // vote() {
  //   this.submitted = true;
  //   let data = {
  //     topic: this.topicID,
  //   };
  //   this.voteService.createNewVoto(data).subscribe((reply: any) => {
  //     this.submitted = false;
  //     console.log({ reply: reply });
  //     if (reply.message == 'create success') {
  //       this.color = '#D9D9D9';
  //       console.log('yes');
  //     }
  //     if (reply.message == 'removed success') {
  //       this.color = 'primary';
  //       console.log('no');
  //     }
  //     this.ngOnInit();
  //   });
  // }
  checkVote() {
    this.color = '';
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
