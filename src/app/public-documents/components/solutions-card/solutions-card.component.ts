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
  @Input() document: any = [];
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @Output() public sendSolutionData = new EventEmitter<any>();
  @Input() coverage: any = null;
  @Input() coverageSelected: any = null;
  public solutions: any[] = [];
  public allSolutions: any[] = [];

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
    this.allSolutions = this.data['filteredData'];
    // this.solutions = this.data['filteredData'];
    this.allSolutions.filter((x: any) => {
      x['coverage'].filter((y: any) => {
        if (y['_id'] == this.coverageSelected) { this.solutions.push(x); }
      });
    });
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

  onSelectCoverage(event: any) {
    this.coverageSelected = event['value'];
    this.solutions = [];
    this.allSolutions.filter((x: any) => {
      x['coverage'].filter((y: any) => {
        if (y == this.coverageSelected) { this.solutions.push(x); }
      });
    });
  }
}
