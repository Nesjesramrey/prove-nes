import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-desciption',
  templateUrl: './modal-desciption.component.html',
  styleUrls: ['./modal-desciption.component.scss'],
})
export class ModalDesciptionComponent implements OnInit {
  public text: string;
  public title: string;

  constructor(
    public dialogRef: MatDialogRef<ModalDesciptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string; title: string }
  ) {
    this.text = data.text;
    this.title = data.title;
  }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
