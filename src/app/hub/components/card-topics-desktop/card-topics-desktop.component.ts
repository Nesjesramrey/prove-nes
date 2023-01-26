import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    public topicService: TopicService,
    public favoritesService: FavoritesService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.loadSuggestedTopics();
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

  loadSuggestedTopics() {
    this.topicService.fetchSuggestionTopic().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.topics = reply;
      },
      complete: () => { }
    });
  }

  loadFavoriteTopics() {
    this.topicService.fetchFavoriteTopicsByUser({ userID: this.user['_id'] }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.topics = reply;
      }
    });
  }

  loadVotedTopics() {
    this.topicService.fetchVotedTopicsByUser({ userID: this.user['_id'] }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.topics = reply;
      }
    });
  }
}
