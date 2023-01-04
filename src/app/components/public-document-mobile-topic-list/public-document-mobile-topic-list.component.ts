import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { AddDocumentThemeComponent } from '../add-document-theme/add-document-theme.component';
import { FilterCoverageDialogComponent } from '../filter-coverage-dialog/filter-coverage-dialog.component';

@Component({
  selector: '.public-document-mobile-topic-list',
  templateUrl: './public-document-mobile-topic-list.component.html',
  styleUrls: ['./public-document-mobile-topic-list.component.scss']
})
export class PublicDocumentMobileTopicListComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  @Input('document') public document: any = null;
  @Input('category') public category: any = null;
  @Input('isCollaborator') public isCollaborator: any = null;
  public topics: any = null;
  public storedTopics: any = null;
  public dataSource = new MatTableDataSource<any>();
  public coverage: any = null;
  public coverageSelected: any = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
  }

  ngOnInit(): void {
    this.topics = this.category['topics'];
    this.storedTopics = this.category['topics'];
    // console.log(this.topics);
    this.dataSource = new MatTableDataSource(this.topics);
    this.coverage = this.document['coverage'];
    if (this.coverageSelected == null) { this.coverageSelected = this.coverage[0]['_id']; };
  }

  linkMe(topicID: string) {
    this.utilityService.linkMe(
      '/documentos-publicos/' + this.documentID + '/categoria/' + this.categoryID + '/subcategoria/' + this.subcategoryID + '/tema/' + topicID
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.topics = this.dataSource['filteredData'];
  }

  popAddDocumentTopic() {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.coverageSelected });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<any>(AddDocumentThemeComponent, {
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: this.subcategoryID,
        coverage: coverage[0]
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        if (reply.hasOwnProperty('topic')) {
          reply['topic']['solutions'] = reply['solutions'];
          this.topics.unshift(reply['topic']);
        } else {
          this.topics.unshift(reply);
        }
        this.dataSource = new MatTableDataSource(this.topics);
      }
    });
  }

  filterTopicCoverage() {
    const dialogRef = this.dialog.open<any>(
      FilterCoverageDialogComponent, {
      width: '100%',
      data: {
        coverage: this.document['coverage']
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.topics = this.storedTopics.filter((x: any) => {
          return x['coverage'][0]['_id'] == reply['selectedCoverage'];
        });
      }
    });
  }
}
