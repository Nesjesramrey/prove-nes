import { Component, OnInit } from '@angular/core';
import { ModalVotesComponent } from 'src/app/public-documents/components/modal-votes/modal-votes.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'topic-single-mobile',
  templateUrl: './topic-single-mobile.component.html',
  styleUrls: ['./topic-single-mobile.component.scss']
})
export class TopicSingleMobileComponent implements OnInit {
  public userVoted: number = 0;
  public topicID: string = '';

  constructor(
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
  ) {
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
   }

  ngOnInit(): void {
    
  }
  loadTopic() {
    
  }


  openModalVote() {
    const dialogRef = this.dialog.open<ModalVotesComponent>(
      ModalVotesComponent,
      {
        width: '500px',
        disableClose: true,
        data: { topic: this.topicID },
      }
    );
    dialogRef.afterClosed().subscribe((reply: any) => {
      this.loadTopic();
    });
  }

}
