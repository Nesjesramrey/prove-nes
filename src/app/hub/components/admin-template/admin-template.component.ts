import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentDialogComponent } from 'src/app/components/add-document-dialog/add-document-dialog.component';

@Component({
  selector: '.admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.scss']
})
export class AdminTemplateComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('documents') public documents: any = [];
  public isDataAvailable: boolean = false;
  public selectedDocument: any = null;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.documents.filter((x: any) => {
        let editors: any = [];
        x['collaborators'].filter((c: any) => {
          if (c['activity']['value'] == 'editor') {
            editors.push(c);
          }
        });
        x['editors'] = editors;
      });
      this.isDataAvailable = true;
    });
  }

  openAddDocumentDialog() {
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      width: '640px',
      data: {
        created_by: this.user['_id']
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.documents.unshift(reply['document']);
      }
    });
  }

  displayDocumentData(documentID: string) {
    let document: any = this.documents.filter((doc: any) => { return doc['_id'] == documentID; });
    this.selectedDocument = null;
    this.selectedDocument = document[0];
    console.log(this.selectedDocument);
  }
}
