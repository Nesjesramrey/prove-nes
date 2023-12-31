import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DialogData } from '../card-topics-mobile/card-topics-mobile.component';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { VoteService } from 'src/app/services/vote.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { TestimonialListComponent } from 'src/app/components/testimonial-list/testimonial-list.component';


@Component({
  selector: 'topic-single-mobile',
  templateUrl: './topic-single-mobile.component.html',
  styleUrls: ['./topic-single-mobile.component.scss']
})
export class TopicSingleMobileComponent implements OnInit {
  @Input('topic') public topic: any = null;
  @Input('user') public user: any = null;
  public document: any = null;
  public topicID: any = null;
  public DialogData: any = null;
  public isDataAvailable: boolean = false;
  public isFavorite: any = null;
  public test: any = null;
  @Input('allFavorites') public allFavorites: any = null;
  @Input('votes') public votes: any = null;
  @Input('userVoted') public userVoted: any = null;
  @Output() public topicVoted = new EventEmitter<any>();
  public isMobile: boolean = false;
  public coverage: any = null;
  public coverageSelected: any = null;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public topicService: TopicService,
    public favoritesService: FavoritesService,
    public voteService: VoteService,
    public matBottomSheet: MatBottomSheet,
    public deviceDetectorService: DeviceDetectorService,
    public utilityService: UtilityService,

  ) { 
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(


  ): void {  
    if (history['state']['coverage'] != undefined) { this.coverageSelected = history['state']['coverage']; };

    this.userService.fetchFireUser().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.user = reply;
        //console.log(this.user);
        // *** load favourites
        this.favoritesService.fetchFavoritesByTopicID({ _id: this.data.topicID }).subscribe({
          error: (error: any) => { },
          next: (reply: any) => {
            this.allFavorites = reply['data'];
            this.isFavorite = this.checkFavorites();
            
            this.loadTopic()
          }, 
          complete: () => { 
            setTimeout(() => {
              this.isDataAvailable = true;
            }, 500);
          }
        });
      },
      complete: () => {
      },
    })



  }


  checkUserVote(votes: any[]) {
    let vote = votes.filter((x: any) => { return x['createdBy'] == this.user['_id']; });
    return votes.find((vote) => vote.createdBy === this.user._id)?._id || 0;
  }


  openModalVote() {
    const dialogRef = this.dialog.open<VoteDialogComponent>(
      VoteDialogComponent,
      {
        width: '500px',
        disableClose: true,
        data: { topic: this.data.topicID },
      }
    );
    dialogRef.afterClosed().subscribe((reply: any) => {
      this.topicVoted.emit({ action: 'vote' });
       this.loadTopic()
    });
  };

  loadTopic(){
    //console.log(this.userVoted)
    this.voteService.fetchVotesByTopicID({ _id: this.data.topicID }).subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.userVoted = this.checkUserVote(reply);
        //console.log(this.userVoted);
        this.voteService.fetchVotesByTopicID({ _id: this.data.topicID }).subscribe({
          error: (error) => {
            switch (error['status']) { }
          },
          next: (reply: any) => {
            this.votes = reply.length;
            //console.log(this.userVoted);
          },
          complete: () => {
          },
        });
      },
      complete: () => {
      },
    });

      // *** load favourites
      this.favoritesService.fetchFavoritesByTopicID({ _id: this.data.topicID }).subscribe({
        error: (error: any) => { },
        next: (reply: any) => {
          //console.log(reply)
          this.allFavorites = reply['data'];

          this.isFavorite = this.checkFavorites();
        },
        complete: () => { }
      });
      
  }

  openBottomSheet(): void {
    const bottomSheetRef = this.matBottomSheet.open(ShareSheetComponent, {
      data: {
        user: this.user
      }
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  getUserFavorited() {
    return this.allFavorites.filter((item: any) => item['createdBy'] === this.data.userID);
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
        topic: this.data.topicID,
        favorites: true,
      };
      this.favoritesService.addFavorites(data).subscribe((reply: any) => {
        if (reply.message == 'favorites add success') {
          this.isFavorite = true;
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
        this.isFavorite = false;
      }
    });
  }

  checkFavorites() {
    let favorited = this.getUserFavorited();
    if (favorited.length > 0) {
      return favorited[0].favorites;
    }
    return false;
  }


  openTestimoniesDialog() {
    const dialogRef = this.dialog.open<any>(TestimonialListComponent, {
      data: {
        location: 'topic',
        topic: this.data.topic,
        topicID: this.data.topicID,
        user: this.data.user
      },
      disableClose: true,
      panelClass: 'full-dialog',
    });

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
      if (reply != undefined) { }
    });
  }



}

