import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { VoteDialogComponent } from 'src/app/components/vote-dialog/vote-dialog.component';
import { MatDialog,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from '../card-topics-mobile/card-topics-mobile.component';
import { UserService } from 'src/app/services/user.service';
import { TopicService } from 'src/app/services/topic.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareSheetComponent } from 'src/app/components/share-sheet/share-sheet.component';




@Component({
  selector: 'topic-single-mobile',
  templateUrl: './topic-single-mobile.component.html',
  styleUrls: ['./topic-single-mobile.component.scss']
})
export class TopicSingleMobileComponent implements OnInit {
  public user: any = null;
  public votes: number = 0;
  @Input('userVoted') public userVoted: any = null;
  @Output() public topicVoted = new EventEmitter<any>();
  public topic: any = null;
  public topicID: string = '';
  public DialogData: any = null;
  public isDataAvailable: boolean = false;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public topicService: TopicService,
    public matBottomSheet: MatBottomSheet,
  ) {}

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
    });
  }


  checkUserVote(votes: any[]) {
    let vote = votes.filter((x: any) => { return x['createdBy'] == this.user['_id']; });
    return votes.find((vote) => vote.createdBy === this.user._id)?._id || 0;
  }

  

  openModalVote() {
    //console.log(this.data)
    const dialogRef = this.dialog.open<VoteDialogComponent>(
      VoteDialogComponent,
      {
        width: '500px',
        disableClose: true,
        data: { topic: this.data.id },
      }
    );
    
      dialogRef.afterClosed().subscribe((reply: any) => {
        this.topicVoted.emit({ action: 'vote' });
      });


  };
 
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


}

