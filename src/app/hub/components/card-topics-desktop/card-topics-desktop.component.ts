import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddCommentsSheetComponent } from 'src/app/components/add-comments-sheet/add-comments-sheet.component';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';
import { FavoritesService } from 'src/app/services/favorites.service';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.card-topics-desktop',
  templateUrl: './card-topics-desktop.component.html',
  styleUrls: ['./card-topics-desktop.component.scss']
})
export class CardTopicsDesktopComponent implements OnInit {
  public topics: any = null;
  @Input('user') public user: any = null;
  public viewing: string = '';

  constructor(
    public topicService: TopicService,
    public favoritesService: FavoritesService,
    public utilityService: UtilityService,
    public matBottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.loadSuggestedTopics('suggestions');
  }

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

  openShareSheet(): void {
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

  handleComments() {
    const bottomSheetRef = this.matBottomSheet.open(AddCommentsSheetComponent, {
      data: {
        // document: this.document,
        user: this.user,
        location: 'document'
      },
      panelClass: 'desktop-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
