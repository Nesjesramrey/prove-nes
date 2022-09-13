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
  constructor(
    public voteService: VoteService,
    public dialogRef: MatDialogRef<ModalVotesComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit(): void {}
  valueQualification(value: any) {
    console.log({ event: value });
    this.qualification = value;
  }
  killDialog() {
    this.dialogRef.close();
  }

  vote() {}
}
