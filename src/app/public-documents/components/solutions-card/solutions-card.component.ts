import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'solutions-card',
  templateUrl: './solutions-card.component.html',
  styleUrls: ['./solutions-card.component.scss'],
})
export class SolutionsCardComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public topicID: string = '';
  public displayedColumns: string[] = ['title', 'stats.score'];
  public SolutionDataSource = new MatTableDataSource<any>();

  @Input() data: any = [];
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(
    private utilityService: UtilityService,
    public activatedRoute: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.data.sort = this.sort;
  }

  redirect(id: string) {
    const path = `documentos-publicos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${this.topicID}/solucion/${id}`;
    this.utilityService.linkMe(path);
  }

  applyFilterSolution(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  }
}
