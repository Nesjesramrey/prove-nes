import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddDocumentTopicFullComponent } from '../add-document-topic-full/add-document-topic-full.component';
import { ComplaintDialogComponent } from '../complaint-dialog/complaint-dialog.component';
import { FloatingSheetComponent } from '../floating-sheet/floating-sheet.component';
import { InviteDialogComponent } from '../invite-dialog/invite-dialog.component';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: '.public-document-mobile-fixed-tools',
  templateUrl: './public-document-mobile-fixed-tools.component.html',
  styleUrls: ['./public-document-mobile-fixed-tools.component.scss']
})
export class PublicDocumentMobileFixedToolsComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('isCollaborator') public isCollaborator: boolean = false;
  public open: boolean = false;
  public topic: any = null;
  @Output() public topicAdded = new EventEmitter<any>();
  public document: any = null;
  public isDataAvailable: boolean = false;
  public documentID: any = null;
  public categoryID: any = null;
  public subcategoryID: any = null;
  public topicID: any = null;
  public solutionID: any = null;

  constructor(
    public dialog: MatDialog,
    public documentService: DocumentService,
    public utilityService: UtilityService,
    public matBottomSheet: MatBottomSheet,
    public activatedRoute: ActivatedRoute
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
    this.solutionID = this.activatedRoute['snapshot']['params']['solutionID'];
  }

  ngOnInit(): void {
    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
      next: (reply: any) => { this.document = reply; },
      complete: () => { this.isDataAvailable = true; }
    });
  }

  displayMenu() {
    // this.open = !this.open;
    const bottomSheetRef = this.matBottomSheet.open(FloatingSheetComponent, {
      data: {
        user: this.user,
        isCollaborator: this.isCollaborator,
        documentID: this.documentID,
        categoryID: this.categoryID,
        subcategoryID: this.subcategoryID,
        topicID: this.topicID,
        solutionID: this.solutionID
      },
      panelClass: 'small-sheet'
    });

    bottomSheetRef.afterDismissed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
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
      data: {
        user: this.user,
        document: this.document
      },
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

  popComplaintsDialog() {
    this.displayMenu();

    const dialogRef = this.dialog.open<any>(ComplaintDialogComponent, {
      width: '100%',
      data: {
        user: this.user
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
