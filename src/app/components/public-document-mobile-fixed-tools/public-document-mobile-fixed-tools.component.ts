import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentTopicFullComponent } from '../add-document-topic-full/add-document-topic-full.component';

@Component({
  selector: '.public-document-mobile-fixed-tools',
  templateUrl: './public-document-mobile-fixed-tools.component.html',
  styleUrls: ['./public-document-mobile-fixed-tools.component.scss']
})
export class PublicDocumentMobileFixedToolsComponent implements OnInit {
  public open: boolean = false;
  public topic: any = null;
  @Output() public topicAdded = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  displayMenu() {
    this.open = !this.open;
  }

  popAddTopicDialog() {
    const dialogRef = this.dialog.open<any>(AddDocumentTopicFullComponent, {
      data: {},
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterOpened().subscribe((reply: any) => { this.displayMenu(); });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        // console.log(reply);
        this.topic = reply;
        this.topicAdded.emit({ added: true, topic: this.topic });
      }
    });
  }
}
