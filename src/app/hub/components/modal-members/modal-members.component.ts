import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'modal-members',
  templateUrl: './modal-members.component.html',
  styleUrls: ['./modal-members.component.scss']
})
export class ModalMembersComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalMembersComponent>

  ) { }

  ngOnInit(): void {
  }

  killDialog() {
    this.dialogRef.close();
  }
}
