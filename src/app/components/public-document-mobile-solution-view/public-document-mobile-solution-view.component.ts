import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddCommentsSheetComponent } from '../add-comments-sheet/add-comments-sheet.component';
import { ShareSheetComponent } from '../share-sheet/share-sheet.component';
import { TestimonialListComponent } from '../testimonial-list/testimonial-list.component';
import { VoteDialogComponent } from '../vote-dialog/vote-dialog.component';

@Component({
  selector: '.public-document-mobile-solution-view',
  templateUrl: './public-document-mobile-solution-view.component.html',
  styleUrls: ['./public-document-mobile-solution-view.component.scss']
})
export class PublicDocumentMobileSolutionViewComponent implements OnInit {
  @Input('document') public document: any = null;
  @Input('solution') public solution: any = null;
  @Input('user') public user: any = null;
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';
  public solutionID: string = '';
  public category: any = null;
  public subcategory: any = null;
  public topic: any = null;
  @Input('allFavorites') public allFavorites: any = null;
  public isFavorite: boolean = false;
  @Input('userVoted') public userVoted: any = null;
  @Output() public solutionVoted = new EventEmitter<any>();
  @Input('votes') public votes: any = null;

  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public utilityservice: UtilityService,
    public favoritesService: FavoritesService,
    public matBottomSheet: MatBottomSheet
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
    this.solutionID = this.activatedRoute['snapshot']['params']['solutionID'];
  }

  ngOnInit(): void {
    // console.log(this.solution);
    let category = this.document['layouts'].filter((x: any) => { return x['_id'] == this.categoryID });
    this.category = category[0];

    let subcategory = category[0]['subLayouts'].filter((x: any) => { return x['_id'] == this.subcategoryID; });
    this.subcategory = subcategory[0];

    let topic = subcategory[0]['topics'].filter((x: any) => { return x['_id'] == this.topicID; });
    this.topic = topic[0];

    let favorite = this.allFavorites.filter((item: any) => item['createdBy'] == this.user['_id']);
    if (favorite.length != 0) {
      this.isFavorite = true;
    } else { this.isFavorite = false; }
  }

  openTestimoniesDialog() {
    const dialogRef = this.dialog.open<any>(TestimonialListComponent, {
      data: {
        location: 'solution',
        solution: this.solution,
        topicID: this.solution['_id'],
        user: this.user
      },
      disableClose: true,
      panelClass: 'full-dialog',
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  linkMe(url: string) {
    this.utilityservice.linkMe(url);
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

      this.favoritesService.updateFavorites(data).subscribe((reply: any) => {
        if (reply.message == 'favorite update success') {
          this.isFavorite = true;
        }
      });
    } else {
      let data = {
        solution: this.solutionID,
        favorites: true,
      };

      this.favoritesService.addFavorites(data).subscribe((reply: any) => {
        console.log(reply);
        if (reply.message == 'favorites add success') {
          this.isFavorite = true;
        }
      });
    }
  }

  openVoteDialog() {
    const dialogRef = this.dialog.open<any>(VoteDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { solution: this.solutionID },
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      this.solutionVoted.emit({ action: 'vote' });
    });
  }

  popShareSheet() {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  handleComments() {
    const bottomSheetRef = this.matBottomSheet.open(AddCommentsSheetComponent, {
      data: {
        document: this.document,
        solution: this.solution,
        user: this.user,
        location: 'solution'
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
