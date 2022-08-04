import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.document-manager-dialog',
  templateUrl: './document-manager.component.html',
  styleUrls: ['./document-manager.component.scss']
})
export class DocumentManagerComponent implements OnInit {
  public type: string = '';
  public document: any = null;
  public dialogTitle: string = '';

  constructor(
    public dialogRef: MatDialogRef<DocumentManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    // console.log(this.dialogData);
  }

  ngOnInit(): void {
    this.type = this.dialogData['type'];
    this.document = this.dialogData['document'];

    switch (this.type) {
      case 'layout':
        this.dialogTitle = 'Agregar Esquema';
        break;

      case 'collaborator':
        this.dialogTitle = 'Agregar Colaborador';
        break;

      case 'category':
        this.dialogTitle = 'Agregar Categoría';
        break;
    }
  }

  killDialog() {
    this.dialogRef.close();
  }
}
