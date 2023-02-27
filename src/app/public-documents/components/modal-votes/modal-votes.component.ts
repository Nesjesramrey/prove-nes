import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(
    public voteService: VoteService,
    public dialogRef: MatDialogRef<ModalVotesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { topic: string | null; solution: string | null }
  ) {
    this.topicID = data.topic;
    this.solutionID = data.solution;
  }

  ngOnInit(): void { }

  valueQualification(value: any) {
    this.qualification = value;
  }

  killDialog() {
    this.dialogRef.close();
  }

  vote() {
    let data = {
      topic: this.topicID,
      solution: this.solutionID,
      value: this.qualification,
    };

    this.voteService.createNewVoto(data).subscribe((reply: any) => {
      if (reply.message == 'create success') {
        this.result = '#D9D9D9';
      }

      if (reply.message == 'removed success') {
        this.result = 'primary';
      }
    });

    this.dialogRef.close(this.result);
  }
}
