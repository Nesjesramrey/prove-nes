import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { UtilityService } from 'src/app/services/utility.service';
import { TestimonialListComponent } from '../testimonial-list/testimonial-list.component';
import { VoteDialogComponent } from '../vote-dialog/vote-dialog.component';

@Component({
  selector: '.public-document-mobile-topic-view',
  templateUrl: './public-document-mobile-topic-view.component.html',
  styleUrls: ['./public-document-mobile-topic-view.component.scss']
})
export class PublicDocumentMobileTopicViewComponent implements OnInit {
  @Input('document') public document: any = null;
  public category: any = null;
  public subcategory: any = null;
  @Input('topic') public topic: any = null;
  @Input('user') public user: any = null;
  public solutions: any[] = [];
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';
  @Input('userVoted') public userVoted: any = null;
  @Input('votes') public votes: any = null;
  public isFavorite: boolean = false;
  @Input('allFavorites') public allFavorites: any = null;
  @Output() public topicVoted = new EventEmitter<any>();
  @Output() public addSolution = new EventEmitter<any>();

  constructor(
    public activatedRoute: ActivatedRoute,
    public utilityservice: UtilityService,
    public dialog: MatDialog,
    public favoritesService: FavoritesService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
  }

  ngOnInit(): void {
    let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID });
    this.category = category[0];

    let subcategory = category[0]['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID; });
    this.subcategory = subcategory[0];

    this.solutions = this.topic['solutions'];

    let favorite = this.allFavorites.filter((item: any) => item['createdBy'] == this.user['_id']);
    if (favorite.length != 0) {
      this.isFavorite = true;
    } else { this.isFavorite = false; }
    // console.log(this.topic);
  }

  linkMe(url: string) {
    this.utilityservice.linkMe(url);
  }

  openTestimoniesDialog() {
    const dialogRef = this.dialog.open<any>(TestimonialListComponent, {
      data: {
        location: 'topic',
        topic: this.topic,
        topicID: this.topic['_id'],
        user: this.user
      },
      disableClose: true,
      panelClass: 'full-dialog',
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  openVoteDialog() {
    const dialogRef = this.dialog.open<any>(VoteDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { topic: this.topicID },
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      this.topicVoted.emit({ action: 'vote' });
    });
  }

  getUserFavorited() {
    return this.allFavorites.filter((item: any) => item['createdBy'] === this.user['_id']);
  }

  addFavorites() {
    let favorited = this.getUserFavorited();

    if (favorited.length > 0) {
      let data = {
        _id: favorited[0]._id,
        favorites: true,
      };
      console.log(data);
      return;

      this.favoritesService.updateFavorites(data).subscribe((reply: any) => {
        if (reply.message == 'favorite update success') {
          this.isFavorite = true;
        }
      });
    } else {
      let data = {
        topic: this.topicID,
        favorites: true,
      };

      this.favoritesService.addFavorites(data).subscribe((reply: any) => {
        if (reply.message == 'favorites add success') {
          this.isFavorite = true;
        }
      });
    }
  }

  popAddSolutionDialog() {
    this.addSolution.emit({ add: true });
  }
}
