import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
import { FavoritesService } from 'src/app/services/favorites.service';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { AddDocumentSolutionComponent } from 'src/app/components/add-document-solution/add-document-solution.component';

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
  public isFavorites: boolean = false;
  public allFavorites: any = null;
  public document: any = null;
  public solution: any = null;
  public category: any = null;
  public subcategory: any = null;
  public topic: any = null;
  public votes: number = 0;
  public image: string = '../../../assets/images/not_fount.jpg';
  public stats: any = {};
  public testimonials: any = TESTIMONIALS;
  public titles: any = [];
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';
  public otherSolutions: any = null;

  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public topicService: TopicService,
    public solutionService: SolutionService,
    public voteService: VoteService,
    public UserService: UserService,
    public favoritesService: FavoritesService,
    public deviceDetectorService: DeviceDetectorService,
    public matBottomSheet: MatBottomSheet,
    public router: Router,
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
    this.solutionID = this.activatedRoute['snapshot']['params']['solutionID'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    // *** load user
    this.user = this.UserService.fetchFireUser().subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.user = reply;
      },
      complete: () => {
        this.fetchVotes();
      }
    });

    // *** load document
    this.documentService.fetchSingleDocumentById({ _id: this.documentID }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.document = reply;

        let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID; });
        this.category = category[0];

        let subcategory = this.category['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID; });
        this.subcategory = subcategory[0];

        let topic = this.subcategory['topics'].filter((x: any) => { return x['_id'] == this.topicID; });
        this.topic = topic[0];
        this.topic['shortTitle'] = this.getshortTitle(this.topic['title']);

        let solution = this.topic['solutions'].filter((x: any) => { return x['_id'] == this.solutionID; });
        this.solution = solution[0];
        this.solution['shortTitle'] = this.getshortTitle(this.solution['title']);
        this.stats = this.solution['stats'];
        if (this.stats == null) { this.stats = { score: 0 } }
        if (this.solution['comments'].length > 0) {
          this.solution['comments'].filter((x: any) => {
            if (x['message'].length > 85) {
              x['truncate'] = true;
            } else {
              x['truncate'] = false;
            }
          });
        }
        // console.log(this.solution);
        this.otherSolutions = this.topic['solutions'].filter((x: any) => { return x['_id'] != this.solutionID; });
      },
      complete: () => {
        this.isDataAvailable = true;
        // console.log(this.topic);
      }
    });

    // *** load favourites
    this.favoritesService.fetchFavoritesBySolutionID({ _id: this.solutionID }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.allFavorites = reply['data'];
        this.isFavorites = this.checkFavorites();
      },
      complete: () => { }
    });
  }

  loadSolution() {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID });
    let topic: Observable<any> = this.topicService.fetchSingleTopicById({ _id: this.topicID });
    let solution: Observable<any> = this.solutionService.fetchSingleSolutionById({ _id: this.solutionID });
    let votes: Observable<any> = this.voteService.fetchVotesBySolutionID({ _id: this.solutionID });
    let favorites: Observable<any> = this.favoritesService.fetchFavoritesBySolutionID({ _id: this.solutionID });

    forkJoin([document, category, subcategory, topic, solution, votes, favorites]).subscribe((reply: any) => {
      this.userVoted = this.checkUserVote(reply[5]);
      this.document = reply[0];
      this.category = reply[1];
      this.subcategory = reply[2];
      this.topic = reply[3];
      this.solution = reply[4];
      this.stats = this.solution.stats;
      this.votes = reply[5].length;
      this.allFavorites = reply[6].data;
      this.isFavorites = this.checkFavorites();
      this.getRamdomImage();

      setTimeout(() => {
        this.getBreadcrumbsTitles();
        this.isDataAvailable = true;
      }, 300);
    });
  }

  addFavorites() {
    let favorited = this.getUserFavorited();
    if (favorited.length > 0) {
      let data = {
        _id: favorited[0]._id,
        favorites: true,
      };
      this.favoritesService.updateFavorites(data).subscribe((reply: any) => {
        if (reply.message == 'favorite update success') {
          this.isFavorites = true;
        }
      });
    } else {
      let data = {
        solution: this.solutionID,
        favorites: true,
      };
      this.favoritesService.addFavorites(data).subscribe((reply: any) => {
        if (reply.message == 'favorites add success') {
          this.isFavorites = true;
        }
        this.allFavorites = [reply.data];
      });
    }
  }

  checkFavorites() {
    let favorited = this.getUserFavorited();
    if (favorited.length > 0) {
      return favorited[0].favorites;
    }
    return false;
  }

  getUserFavorited() {
    return this.allFavorites.filter(
      (item: any) => item.createdBy === this.user._id
    );
  }

  removeFavorites() {
    let favorited = this.getUserFavorited();
    let data = {
      _id: favorited[0]._id,
      favorites: false,
    };
    this.favoritesService.updateFavorites(data).subscribe((reply: any) => {
      if (reply.message == 'favorite update success') {
        this.isFavorites = false;
      }
    });
  }

  getRamdomImage() {
    let testimonials_withs_images = this.solution.testimonials.filter(
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
    return votes.find((vote) => vote.createdBy === this.user._id)?._id || 0;
  }

  openModalTestimony(event: any) {
    const dialogRef = this.dialog.open<AddDocumentTestimonyComponent>(AddDocumentTestimonyComponent, {
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: this.categoryID,
        topicID: this.solutionID,
        type: 'solution',
        image: this.image,
        user: this.user
      },
      disableClose: true,
      panelClass: 'full-dialog'
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

  popAddCommentsDialog() {
    let coverage = this.solution['coverage'];
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
      if (reply != undefined) { this.solution['comments'].unshift(reply); }
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

  fetchVotes() {
    this.voteService.fetchVotesBySolutionID({ _id: this.solutionID }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.votes = reply.length;
        this.userVoted = this.checkUserVote(reply);
      },
      complete: () => { }
    });
  }

  getVoteStatus(event: any) {
    this.fetchVotes();
  }

  openBottomSheet(): void {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user
      },
      panelClass: 'desktop-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  toggleCommentMessage(comment: any) {
    let com: any = this.solution['comments'].filter((x: any) => { return x['_id'] == comment['_id']; });
    com[0]['truncate'] = !com[0]['truncate'];
  }

  loadOtheSolution(solutionID: string) {
    this.utilityService.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.utilityService.router.navigate([solutionID]));
  }

  openModalSolution(event: any) {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.topic['coverage'][0]['_id'] });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddDocumentSolutionComponent>(AddDocumentSolutionComponent, {
      data: {
        themeID: this.topicID,
        coverage: coverage[0]
      },
      disableClose: true,
      panelClass: 'side-dialog'
    }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        const solution = reply.solutions[0];
        this.topic['solutions'].unshift(solution);
        this.otherSolutions = this.topic['solutions'].filter((x: any) => { return x['_id'] != this.solutionID; });
      }
    });
  }

  popCitizensWall(type: string) {
    this.router.navigateByUrl('/posts', {
      state:
        { solution: this.solutionID, load: type }
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
