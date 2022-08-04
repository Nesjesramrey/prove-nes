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
  @Input('documents') public documents: any = [];

  constructor(
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      // console.log(this.documents);
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
      if (reply != undefined) { }
    });
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
