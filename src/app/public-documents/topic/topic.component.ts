import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { forkJoin, Observable } from 'rxjs';
import { LayoutService } from 'src/app/services/layout.service';
import { DocumentService } from 'src/app/services/document.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentTestimonyComponent } from 'src/app/components/add-document-testimony/add-document-testimony.component';
import { AddDocumentSolutionComponent } from 'src/app/components/add-document-solution/add-document-solution.component';
import { VoteService } from 'src/app/services/vote.service';
import { ModalVotesComponent } from '../components/modal-votes/modal-votes.component';
import { UserService } from 'src/app/services/user.service';
import { AddDocumentCommentComponent } from 'src/app/components/add-document-comment/add-document-comment.component';
import { MatTableDataSource } from '@angular/material/table';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { CustomMatDataSource } from '../custom-class/custom-table.component';
import { FavoritesService } from 'src/app/services/favorites.service';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { ComplaintDialogComponent } from 'src/app/components/complaint-dialog/complaint-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { TestimonyDialogComponent } from 'src/app/components/testimony-dialog/testimony-dialog.component';

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
  public stats: any;
  public isFavorites: boolean = false;
  public allFavorites: any = null;
  public testimonials: any = [];
  public solutionsData: any[] = [];
  public titles: any = [];
  public coverage: any = null;
  public coverageSelected: any = null;
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';
  public isCollaborator: boolean = false;
  public commentFormGroup!: FormGroup;
  public isPosting: boolean = false;

  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public layoutService: LayoutService,
    public topicService: TopicService,
    public voteService: VoteService,
    public userService: UserService,
    public favoritesService: FavoritesService,
    public deviceDetectorService: DeviceDetectorService,
    public matBottomSheet: MatBottomSheet,
    public router: Router,
    public formBuilder: FormBuilder,
    public commentService: CommentService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    if (history['state']['coverage'] != undefined) { this.coverageSelected = history['state']['coverage']; };

    let user: Observable<any> = this.userService.fetchFireUser();
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let favorite: Observable<any> = this.favoritesService.fetchFavoritesByTopicID({ _id: this.topicID });

    forkJoin([user, document, favorite]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.user = reply[0];
        this.user['role'] = this.user['activities'][0]['value'];

        if (['administrator', 'editor'].includes(this.user.activities?.[0]?.value)) {
          this.permission = true;
        } else {
          this.permission = false;
        }

        this.document = reply[1];
        this.coverage = this.document['coverage'];

        let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID; });
        this.category = category[0];

        let subcategory = this.category['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID; });
        this.subcategory = subcategory[0];

        let topic = this.subcategory['topics'].filter((x: any) => { return x['_id'] == this.topicID; });
        this.topic = topic[0];
        this.stats = this.topic['stats'];
        if (this.topic['comments'].length > 0) {
          this.topic['comments'].filter((x: any) => {
            if (x['message'].length > 85) {
              x['truncate'] = true;
            } else {
              x['truncate'] = false;
            }
          });
        }
        // console.log(this.topic['comments']);

        this.solutionsData = this.topic['solutions'];
        this.solutionsData.filter((x: any) => {
          if (x['stats'] == null) {
            x['stats'] = { score: 0 }
          }
        });
        this.SolutionDataSource = new MatTableDataSource(this.sortSolutions(this.solutionsData));

        this.topic['shortTitle'] = this.getshortTitle(this.topic['title']);

        this.coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.topic['coverage'][0]['_id']; });
        if (this.coverageSelected == null) { this.coverageSelected = this.coverage[0]['_id']; };

        switch (this.user['role']) {
          case 'administrator':
            this.isCollaborator = true;
            break;

          case 'editor':
            this.isCollaborator = true;
            break;

          case 'citizen':
            let collaborator: any = this.document['collaborators'].filter((x: any) => {
              return x['user']['_id'] == this.user['_id'];
            });
            if (collaborator.length != 0) { this.isCollaborator = true; }
            break;
        }

        this.allFavorites = reply[2]['data'];
        this.isFavorites = this.checkFavorites();
        // console.log(this.solutionsData);
      },
      complete: () => {
        this.fetchVotes();
        this.commentFormGroup = this.formBuilder.group({
          message: ['', [Validators.required]],
          file: ['', []]
        });
        this.isDataAvailable = true;
      }
    });
  }

  loadTopic() {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID });
    let topic: Observable<any> = this.topicService.fetchSingleTopicById({ _id: this.topicID });
    let votes: Observable<any> = this.voteService.fetchVotesByTopicID({ _id: this.topicID });
    let favorites: Observable<any> = this.favoritesService.fetchFavoritesByTopicID({ _id: this.topicID });

    forkJoin([document, category, subcategory, topic, votes, favorites]).subscribe((reply: any) => {
      this.titles = this.utilityService.formatTitles(reply[0].title, reply[1].category.name, reply[2].category.name, reply[3].title);
      this.userVoted = this.checkUserVote(reply[4]);
      this.allFavorites = reply[5].data;
      this.isFavorites = this.checkFavorites();
      this.document = reply[0];
      this.category = reply[1];
      this.subcategory = reply[2];
      this.topic = reply[3];
      this.stats = this.topic.stats;
      this.votes = reply[4].length;
      this.solutionsData = this.topic.solutions;
      this.SolutionDataSource = new CustomMatDataSource(this.sortSolutions(this.solutionsData));

      this.coverage = this.document['coverage'];
      this.coverage = this.document['coverage'].filter((x: any) => {
        return x['_id'] == this.topic['coverage'][0];
      });
      if (this.coverageSelected == null) { this.coverageSelected = this.coverage[0]['_id']; }
      this.getRamdomImage();

      setTimeout(() => {
        this.getBreadcrumbsTitles();
        this.isDataAvailable = true;
      }, 100);
    });
  }

  checkFavorites() {
    let favorited = this.getUserFavorited();
    if (favorited.length > 0) {
      return favorited[0].favorites;
    }
    return false;
  }

  getUserFavorited() {
    return this.allFavorites.filter((item: any) => item.createdBy === this.user._id);
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
        topic: this.topicID,
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
    let vote = votes.filter((x: any) => { return x['createdBy'] == this.user['_id']; });
    return votes.find((vote) => vote.createdBy === this.user._id)?._id || 0;
  }

  openModalTestimony(event: any) {
    // const dialogRef = this.dialog.open<AddDocumentTestimonyComponent>(
    //   AddDocumentTestimonyComponent, {
    //   data: {
    //     documentID: this.documentID,
    //     document: this.document,
    //     categoryID: this.categoryID,
    //     topicID: this.topicID,
    //     type: 'topic',
    //     image: this.image,
    //     firstname: this.user['firstname'],
    //     lastname: this.user['lastname'],
    //     user: this.user
    //   },
    //   disableClose: true,
    //   panelClass: 'full-dialog'
    // });

    // dialogRef.afterClosed().subscribe((reply: any) => {
    //   if (reply != undefined) {
    //     this.topic.testimonials.unshift(reply.testimonials[0]);
    //   }
    // });

    const dialogRef = this.dialog.open<any>(TestimonyDialogComponent, {
      data: {
        user: this.user,
        topic: this.topic
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popComplaintsDialog() {
    const dialogRef = this.dialog.open<any>(ComplaintDialogComponent, {
      width: '100%',
      data: {
        user: this.user
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
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
        this.solutionsData.unshift(solution);
        this.SolutionDataSource = new MatTableDataSource(this.solutionsData);
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
      if (reply != undefined) { }
    });
  }

  popAddCommentsDialog() {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.topic['coverage'][0]['_id'] });
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
      if (reply != undefined) { this.topic['comments'].unshift(reply); }
    });
  }

  unVote() {
    this.voteService.deleteVote({ _id: this.userVoted }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // this.loadTopic();
      },
      complete: () => { }
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

  sortSolutions(data: any) {
    return data.sort((a: any, b: any) => {
      return b.stats.score - a.stats.score;
    });
  }

  fetchVotes() {
    this.voteService.fetchVotesByTopicID({ _id: this.topicID }).subscribe({
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
    let com: any = this.topic['comments'].filter((x: any) => { return x['_id'] == comment['_id']; });
    com[0]['truncate'] = !com[0]['truncate'];
  }

  linkSolution(id: string) {
    const path = `documentos-publicos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${this.topicID}/solucion/${id}`;
    this.utilityService.linkMe(path);
  }

  popCitizensWall(type: any) {
    this.router.navigateByUrl('/posts', {
      state:
        { topic: this.topicID }
    });
  }

  onFileSelected(event: any) {
    this.commentFormGroup.patchValue({ file: event.target.files[0] });
    this.commentFormGroup.updateValueAndValidity();
  }

  onComment(formGroup: FormGroup) {
    this.isPosting = true;
    let url = this.router['url'];
    url = url.replace('/documentos-publicos/', '/documentos/');
    url = url.replace('/tema/', '/temas/');

    let data: any = {
      location: 'topic',
      document_id: this.documentID,
      location_id: this.topicID,
      formData: new FormData(),
    };

    data['formData'].append('file', this.commentFormGroup.controls['file']['value']);
    data['formData'].append('message', formGroup['value']['message']);
    data['formData'].append('coverage', JSON.stringify([this.topic['coverage'][0]['_id']]));
    data['formData'].append('redirectURL', url);

    this.commentService.createNewTopicComment(data).subscribe({
      error: (error: any) => {
        this.isPosting = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.topic['comments'].unshift(reply);
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => {
        this.isPosting = false;
        this.commentFormGroup.reset();
      }
    });
  }
}
