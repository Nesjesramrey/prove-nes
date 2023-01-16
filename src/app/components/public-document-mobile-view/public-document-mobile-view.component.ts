import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatList, MatListOption } from '@angular/material/list';
import { DescriptionViewerComponent } from 'src/app/components/description-viewer/description-viewer.component';

@Component({
  selector: '.public-document-mobile-view',
  templateUrl: './public-document-mobile-view.component.html',
  styleUrls: ['./public-document-mobile-view.component.scss']
})
export class PublicDocumentMobileViewComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('document') public document: any = null;
  @Input('topSolutions') public topSolutions: any = null;
  @Input('storedSolutions') public storedSolutions: any = null;
  public open: boolean = false;
  @ViewChild('states') public states!: any;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // console.log(this.document);
  }

  getCoverageMenuStatus(data: any) {
    this.open = data['open'];
  }

  displayCoverageMenu() {
    this.open = !this.open;
    // this.states['selectedOptions']['selected'].filter((x: any) => { x['value'] = ''; });
  }

  onCoverageSelected(option: MatListOption[]) {
    let selection: any = [];
    let coverage: any = [];
    option.filter((x: any) => { selection.push(x['value']); });
    coverage = this.document['coverage'].filter((x: any) => { return selection.includes(x['_id']); });
    // console.log(coverage);
  }

  openModalDescription() {
    const dialogRef = this.dialog.open<DescriptionViewerComponent>(
      DescriptionViewerComponent, {
      data: {
        document: this.document,
        title: this.document['title'],
        text: this.document['description'],
        user: this.user,
        location: 'document'
      },
      disableClose: true,
      panelClass: 'viewer-dialog',
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  onFilterSolutions() {
    let ids: any[] = [];
    this.states['selectedOptions']['selected'].filter((x: any) => { ids.push(x['value']); });

    this.topSolutions = [];
    this.storedSolutions.filter((x: any) => {
      if (x['stats'] == null) { x['stats'] = { score: 0 } }

      x['coverage'].filter((c: any) => {
        if (ids.includes(c['_id'])) { this.topSolutions.push(x); }
      });
    });

    this.displayCoverageMenu();
  }
}
