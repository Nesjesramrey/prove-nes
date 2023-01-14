import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddDocumentTopicFullComponent } from '../add-document-topic-full/add-document-topic-full.component';
import { ComplaintDialogComponent } from '../complaint-dialog/complaint-dialog.component';
import { InviteDialogComponent } from '../invite-dialog/invite-dialog.component';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: '.floating-sheet',
  templateUrl: './floating-sheet.component.html',
  styleUrls: ['./floating-sheet.component.scss']
})
export class FloatingSheetComponent implements OnInit {
  public user: any = null;
  public document: any = null;
  public isCollaborator: boolean = false;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<FloatingSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
    public dialog: MatDialog,
    public documentService: DocumentService,
    public utilityService: UtilityService
  ) {
    // console.log(this.sheetData);
    this.user = this.sheetData['user'];
    this.isCollaborator = this.sheetData['isCollaborator'];
  }

  ngOnInit(): void {
    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.bottomSheetRef.dismiss();
      },
      next: (reply: any) => { this.document = reply; },
      complete: () => { }
    });
  }

  popComplaintsDialog() {
    this.killSheet();

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

  popAddTopicDialog() {
    this.killSheet();

    const dialogRef = this.dialog.open<any>(AddDocumentTopicFullComponent, {
      data: {
        user: this.user,
        document: this.document
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popInviteDialog() {
    this.killSheet();

    const dialogRef = this.dialog.open<any>(InviteDialogComponent, {
      width: '100%',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popSearchDialog() {
    this.killSheet();

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

  killSheet() {
    this.bottomSheetRef.dismiss();
  }
}
