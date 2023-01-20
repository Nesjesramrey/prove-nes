import { Component, OnInit } from '@angular/core';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: '.card-topics-desktop',
  templateUrl: './card-topics-desktop.component.html',
  styleUrls: ['./card-topics-desktop.component.scss']
})
export class CardTopicsDesktopComponent implements OnInit {
  public topics: any = null;

  constructor(
    public topicService: TopicService
  ) { }

  ngOnInit(): void {
    this.topicService.fetchSuggestionTopic().subscribe({
      error: (error) => {
        switch (error['status']) { }
      },
      next: (reply: any) => {
        this.topics = reply;
        console.log(this.topics);
      },
      complete: () => { }
    })
  }
}
