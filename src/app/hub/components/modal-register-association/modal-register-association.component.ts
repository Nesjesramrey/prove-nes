import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'modal-register-association',
  templateUrl: './modal-register-association.component.html',
  styleUrls: ['./modal-register-association.component.scss']
})
export class ModalRegisterAssociationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalRegisterAssociationComponent>
  ) { }

  ngOnInit(): void {
  }
  killDialog() {
    this.dialogRef.close();
  }
}
