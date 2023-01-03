import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TopicSingleMobileComponent } from '../topic-single-mobile/topic-single-mobile.component';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';

export interface DialogData {
  id: null;
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
            id: this.topic._id,
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



  constructor(
    public dialog: MatDialog,
    public topicService: TopicService,
    public userService: UserService,
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

}
