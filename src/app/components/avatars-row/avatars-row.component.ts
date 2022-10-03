import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentUserListComponent } from '../document-user-list/document-user-list.component';

@Component({
  selector: 'avatars-row',
  templateUrl: './avatars-row.component.html',
  styleUrls: ['./avatars-row.component.scss'],
})
export class AvatarsRowComponent implements OnInit {
  @Input() title: string = "Gestiona";
  @Input() showIcon: boolean = true;
  @Input() users: any = [];

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  popDocumentUserListDialog() {
    const dialogRef = this.dialog.open<DocumentUserListComponent>(DocumentUserListComponent, {
      data: {
        users: this.users,
        location: 'document'
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
