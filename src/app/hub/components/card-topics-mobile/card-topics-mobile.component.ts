import { Component, OnInit, Input, Output } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { TopicSingleMobileComponent } from '../topic-single-mobile/topic-single-mobile.component';
import { FavoritesService } from 'src/app/services/favorites.service';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';

export interface DialogData {
  user: null;
  userID: null;
  topic: null;
  topicID: null;
  topicTitle: null;
  topicDescription: null;
}

@Component({
  selector: 'card-topics-mobile',
  templateUrl: './card-topics-mobile.component.html',
  styleUrls: ['./card-topics-mobile.component.scss']
})
export class CardTopicsMobileComponent implements OnInit {
  public user: any = null;
  public topics: any = null;
  public topic: any = null;
  public isDataAvailable: boolean = false;
  public isFavorite: boolean = false;
  public allFavorites: any = null;

  constructor(
    public dialog: MatDialog,
    public topicService: TopicService,
    public userService: UserService,
    public matBottomSheet: MatBottomSheet,
    public favoritesService: FavoritesService,

  ) {

  }

  ngOnInit(): void {
    this.userService.fetchFireUser().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.user = reply;
        //console.log(this.user);

        // *** load favourites
        this.favoritesService.fetchFavoritesByTopicID({ _id: '6399ea5161aaa9ec2660b014' }).subscribe({
          error: (error: any) => { },
          next: (reply: any) => {
            this.allFavorites = reply['data'];
            //console.log(this.allFavorites)
            this.isFavorite = this.checkFavorites();
          },
          complete: () => { }
        });
      },
      complete: () => {
        this.isDataAvailable = true;
      },
    })

    this.topicService.fetchSuggestionTopic().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.topics = reply;
        //console.log(this.topics);
      },
      complete: () => {
      },
    })
  }

  openDialog(id: any) {
    //console.log(id)
    this.topicService.fetchSingleTopicById({ _id: id }).subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.topic = reply;
        //console.log(this.topic);
        this.dialog.open(TopicSingleMobileComponent, {
          data: {
            user: this.user,
            userID: this.user._id,
            topic: this.topic,
            topicID: this.topic._id,
            topicTitle: this.topic.title,
            topicDescription: this.topic.description
          },
          height: '100%',
          maxWidth: '100%',
          panelClass: 'full-dialog'
        });
      },
      complete: () => {
      },
    })
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
  };

  getUserFavorited() {
    return this.allFavorites.filter((item: any) => item['createdBy'] === this.user._id);
  }

  addFavorites(idTopic: any) {
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
        topic: idTopic,
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
}
