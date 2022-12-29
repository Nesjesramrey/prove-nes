import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddDocumentTopicFullComponent } from '../add-document-topic-full/add-document-topic-full.component';
import { InviteDialogComponent } from '../invite-dialog/invite-dialog.component';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: '.public-document-mobile-fixed-tools',
  templateUrl: './public-document-mobile-fixed-tools.component.html',
  styleUrls: ['./public-document-mobile-fixed-tools.component.scss']
})
export class PublicDocumentMobileFixedToolsComponent implements OnInit {
  public open: boolean = false;
  public topic: any = null;
  @Output() public topicAdded = new EventEmitter<any>();
  public document: any = null;

  constructor(
    public dialog: MatDialog,
    public documentService: DocumentService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void { }

  displayMenu() {
    this.open = !this.open;
  }

  popInviteDialog() {
    this.displayMenu();

    const dialogRef = this.dialog.open<any>(InviteDialogComponent, {
      width: '100%',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popAddTopicDialog() {
    this.displayMenu();

    const dialogRef = this.dialog.open<any>(AddDocumentTopicFullComponent, {
      data: {},
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        // console.log(reply);
        this.topic = reply;
        this.topicAdded.emit({ added: true, topic: this.topic });
      }
    });
  }

  popSearchDialog() {
    this.displayMenu();

    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.document = reply;
        const dialogRef = this.dialog.open<any>(SearchDialogComponent, {
          data: {
            document_id: this.document['_id']
          },
          disableClose: true
        });

        dialogRef.afterClosed().subscribe((reply: any) => {
          if (reply != undefined) { }
        });
      }
    });
  }
}
