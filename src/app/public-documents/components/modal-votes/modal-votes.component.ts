import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from 'src/app/services/utility.service';
import { VoteService } from 'src/app/services/vote.service';

@Component({
  selector: 'app-modal-votes',
  templateUrl: './modal-votes.component.html',
  styleUrls: ['./modal-votes.component.scss'],
})
export class ModalVotesComponent implements OnInit {
  public qualification: any = null;
  public value: any;
  public topicID: string | null;
  public solutionID: string | null;
  public result: any;
  public submitted: boolean = false;

  constructor(
    public voteService: VoteService,
    public dialogRef: MatDialogRef<ModalVotesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { topic: string | null; solution: string | null },
    public utilityService: UtilityService
  ) {
    this.topicID = data.topic;
    this.solutionID = data.solution;
    // console.log(data);
  }

  ngOnInit(): void { }

  valueQualification(value: any) {
    this.qualification = value;
  }

  killDialog() {
    this.dialogRef.close();
  }

  vote() {
    this.submitted = true;

    let data = {
      topic: this.topicID,
      solution: this.solutionID,
      value: this.qualification,
    };

    // this.voteService.createNewVoto(data).subscribe((reply: any) => {
    //   if (reply.message == 'create success') {
    //     this.result = '#D9D9D9';
    //   }

    //   if (reply.message == 'removed success') {
    //     this.result = 'primary';
    //   }
    // });

    // this.dialogRef.close(this.result);

    this.voteService.createNewVoto(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        if (reply.message == 'create success') { this.result = '#D9D9D9'; }
        if (reply.message == 'removed success') { this.result = 'primary'; }
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => {
        this.submitted = false;
        this.dialogRef.close(this.result);
      }
    });
  }
}
