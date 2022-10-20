import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { MatSort } from '@angular/material/sort';

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
  @Input() data: any = [];
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @Output() public sendSolutionData = new EventEmitter<any>();

  constructor(
    private utilityService: UtilityService,
    public activatedRoute: ActivatedRoute
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.topicID = this.activatedRoute['snapshot']['params']['topicID'];
  }

  ngOnInit(): void {
    // console.log(this.data);
  }

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

  addFirstSolution() {
    this.sendSolutionData.emit({ add: true });
  }
}
