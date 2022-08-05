import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.add-document-collaborator',
  templateUrl: './add-document-collaborator.component.html',
  styleUrls: ['./add-document-collaborator.component.scss']
})
export class AddDocumentCollaboratorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddDocumentCollaboratorComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) { }

  ngOnInit(): void { }

  killDialog() {
    this.dialogRef.close();
  }
}
