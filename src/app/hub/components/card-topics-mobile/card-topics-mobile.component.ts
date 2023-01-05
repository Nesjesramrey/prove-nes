import { Component, OnInit,} from '@angular/core';
import { MatDialog,} from '@angular/material/dialog';
import { TopicSingleMobileComponent } from '../topic-single-mobile/topic-single-mobile.component';
import { FavoritesService } from 'src/app/services/favorites.service';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';

export interface DialogData {
  userID: null;
  topicID: null;
  title: null;
  description: null;
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
  public location: string = '';
  public allFavorites: any[] = [];
 
  constructor(
    public dialog: MatDialog,
    public topicService: TopicService,
    public userService: UserService,
    public matBottomSheet: MatBottomSheet,
    public favoritesService: FavoritesService,
  
    ) { 
      //this.location = this.dialogData['location'];
    }
  

  ngOnInit(): void {

    this.topicService.fetchSuggestionTopic().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.topics = reply;
        //console.log(this.topics);
      },
      complete: () => {
        this.isDataAvailable = true;
      },
    })

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
            userID: this.user._id,
            topicID: this.topic._id,
            title: this.topic.title,
            description: this.topic.description
          },
          height: '100%',
          maxWidth: '100%',
          panelClass: 'full-dialog'
        });
      },
      complete: () => {
        this.isDataAvailable = true;
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
        topic:  this.topic.id,
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

  
}
