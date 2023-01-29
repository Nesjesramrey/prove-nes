import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'modal-authorization-join',
  templateUrl: './modal-authorization-join.component.html',
  styleUrls: ['./modal-authorization-join.component.scss']
})
export class ModalAuthorizationJoinComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalAuthorizationJoinComponent>
  ) { }

  ngOnInit(): void {
  }

  killDialog() {
    this.dialogRef.close();
  }
}
