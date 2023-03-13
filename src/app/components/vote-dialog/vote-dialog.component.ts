import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { VoteService } from 'src/app/services/vote.service';

@Component({
  selector: '.vote-dialog',
  templateUrl: './vote-dialog.component.html',
  styleUrls: ['./vote-dialog.component.scss']
})
export class VoteDialogComponent implements OnInit {
  public voteTypes: any[] = [
    { title: 'No relevante', score: 1, selected: false },
    { title: 'Relevante', score: 2, selected: false },
    { title: 'Muy relevante', score: 3, selected: false }
  ];
  public post: any = null;
  public complaintID: any = null;
  public testimonyID: any = null;

  constructor(
    public dialogRef: MatDialogRef<VoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public voteService: VoteService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    if (this.dialogData['post'] != undefined) {
      this.post = this.dialogData['post'];
      switch (this.post['relation']) {
        case 'complaint':
          this.complaintID = this.post['card']['_id'];
          break;
        case 'testimony':
          this.testimonyID = this.post['card']['_id'];
          break;
      }
    }
  }

  ngOnInit(): void { }

  selectRate(index: number) {
    this.voteTypes.filter((x: any) => { x['selected'] = false; });
    let vote = this.voteTypes[index];
    vote['selected'] = true;
    let data: any = {};

    if (this.post != undefined) {
      switch (this.post['relation']) {
        case 'complaint':
          data = {
            complaint: this.complaintID,
            value: vote['score']
          }
          break;

        case 'testimony':
          data = {
            testimony: this.testimonyID,
            value: vote['score']
          }
          break;
      }
    } else {
      data = {
        topic: this.dialogData['topic'] || null,
        solution: this.dialogData['solution'] || null,
        value: vote['score']
      }
    }

    this.voteService.createNewVoto(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
