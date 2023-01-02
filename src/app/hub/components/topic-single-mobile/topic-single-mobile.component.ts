import { Component, OnInit, Inject } from '@angular/core';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';
import { MatDialog,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from '../card-topics-mobile/card-topics-mobile.component';




@Component({
  selector: 'topic-single-mobile',
  templateUrl: './topic-single-mobile.component.html',
  styleUrls: ['./topic-single-mobile.component.scss']
})
export class TopicSingleMobileComponent implements OnInit {
  public userVoted: number = 0;
  public topic: any = null;
  public topicID: string = '';
  public DialogData: any = null
  


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    
    
  }
  loadTopic() {
    
  }


  openModalVote() {
    const dialogRef = this.dialog.open<VoteDialogComponent>(
      VoteDialogComponent,
      {
        width: '500px',
        disableClose: true,
        data: { topic: this.topic },
      }
    );
    dialogRef.afterClosed().subscribe((reply: any) => {
      this.loadTopic();
    });
  }

}

