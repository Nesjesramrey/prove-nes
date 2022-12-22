import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.public-document-mobile-topic-list',
  templateUrl: './public-document-mobile-topic-list.component.html',
  styleUrls: ['./public-document-mobile-topic-list.component.scss']
})
export class PublicDocumentMobileTopicListComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  @Input('category') public category: any = null;
  public topics: any = null;
  public dataSource = new MatTableDataSource<any>();

  constructor(
    public activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
  }

  ngOnInit(): void {
    this.topics = this.category['topics'];
    // console.log(this.topics);
    this.dataSource = new MatTableDataSource(this.topics);
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
}
