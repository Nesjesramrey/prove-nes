import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentLayoutComponent } from 'src/app/components/add-document-layout/add-document-layout.component';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.editor-template',
  templateUrl: './editor-template.component.html',
  styleUrls: ['./editor-template.component.scss']
})
export class EditorTemplateComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('documents') public documents: any = [];
  public isDataAvailable: boolean = false;

  constructor(
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    });
  }

  popLayoutDialog(documentID: string) {
    let document: any = this.documents.filter((x: any) => {
      return x['_id'] == documentID
    });

    const dialogRef = this.dialog.open(AddDocumentLayoutComponent, {
      width: '640px',
      data: {
        document: document[0]
      }
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        document[0]['images'] = reply['document']['images'];
        document[0]['layouts'] = reply['layouts'];
      }
    });
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  viewDocument(document: any) {
    console.log(document);
  }
}
