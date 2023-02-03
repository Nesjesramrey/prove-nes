import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  public card: any = null;

  constructor(
    public dialogRef: MatDialogRef<VoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public voteService: VoteService
  ) {
    console.log(this.dialogData);
    if (this.dialogData['card'] != undefined) { this.card = this.dialogData['card']; }
  }

  ngOnInit(): void { }

  selectRate(index: number) {
    this.voteTypes.filter((x: any) => { x['selected'] = false; });
    let vote = this.voteTypes[index];
    vote['selected'] = true;
    let data: any = {
      topic: this.dialogData['topic'] || null,
      solution: this.dialogData['solution'] || null,
      post: this.dialogData['post'] || null,
      value: vote['score']
    };
    this.voteService.createNewVoto(data).subscribe((reply: any) => {
      console.log(reply);
      this.dialogRef.close(reply);
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
