import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { VoteService } from 'src/app/services/vote.service';

@Component({
  selector: '.team-vote-dialog',
  templateUrl: './team-vote-dialog.component.html',
  styleUrls: ['./team-vote-dialog.component.scss']
})
export class TeamVoteDialogComponent implements OnInit {
  public team: any = null;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TeamVoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public voteService: VoteService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.team = this.dialogData['team'];
  }

  ngOnInit(): void { }

  killDialog() { this.dialogRef.close(); }

  voteTeam() {
    this.submitted = true;
    let data: any = { team: this.team['_id'] }
    this.voteService.createNewVoto(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.submitted = false;
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
        this.dialogRef.close(reply);
      },
      complete: () => { }
    });
  }
}
