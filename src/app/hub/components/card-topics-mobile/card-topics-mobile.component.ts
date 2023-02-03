import { Component, OnInit, Input, Output } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { TopicSingleMobileComponent } from '../topic-single-mobile/topic-single-mobile.component';
import { FavoritesService } from 'src/app/services/favorites.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
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
  public topics: any = null;
  @Input('user') public user: any = null;
  public topic: any = null;
  public isDataAvailable: boolean = false;
  public isFavorite: boolean = false;
  public allFavorites: any = null;
  public myFavorites: any = [];
  public viewing: string = '';

  constructor(
    public dialog: MatDialog,
    public topicService: TopicService,
    public userService: UserService,
    public matBottomSheet: MatBottomSheet,
    public favoritesService: FavoritesService,
    public utilityService: UtilityService

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

      },
      complete: () => {
        this.isDataAvailable = true;
      },
    })
    this.loadSuggestedTopics('suggestions');
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

  linkMe(topic: any) {
    let url: any = '/documentos-publicos/' + topic['parents']['document'] +
      '/categoria/' + topic['parents']['layout'] +
      '/subcategoria/' + topic['parents']['sublayout'] +
      '/tema/' + topic['_id'];
    this.utilityService.linkMe(url);
  }

  addFavorite(topic: any) {
    let data = {
      topic: topic['_id'],
      favorites: true,
    };

    this.favoritesService.addFavorites(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.topics = this.topics.filter((x: any) => { return x['_id'] != topic['_id'] });
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      }
    });
  }

  loadSuggestedTopics(type: string) {
    this.topicService.fetchSuggestionTopic().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => { this.topics = reply; },
      complete: () => { this.viewing = type; }
    });
  }

  loadFavoriteTopics(type: string) {
    this.topicService.fetchFavoriteTopicsByUser({ userID: this.user['_id'] }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.topics = reply; },
      complete: () => { this.viewing = type; }
    });
  }

  loadVotedTopics(type: string) {
    this.topicService.fetchVotedTopicsByUser({ userID: this.user['_id'] }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => { this.topics = reply; },
      complete: () => { this.viewing = type; }
    });
  }


}
