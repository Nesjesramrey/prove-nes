import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentSolutionComponent } from 'src/app/components/add-document-solution/add-document-solution.component';
import { MatTableDataSource } from '@angular/material/table';


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
  public dataSource = new MatTableDataSource;
  @Input() data: any = [];
  @Input() document: any = [];
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @Output() public sendSolutionData = new EventEmitter<any>();
  @Input() coverage: any = null;
  @Input() coverageSelected: any = null;
  @Input('topic') topic: any = null;
  public solutions: any[] = [];
  public allSolutions: any[] = [];

  constructor(
    private utilityService: UtilityService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router
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

    this.dataSource = new MatTableDataSource(this.solutions);
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

  openModalSolution(event: any) {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.topic['coverage'][0]['_id'] });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddDocumentSolutionComponent>(AddDocumentSolutionComponent, {
      data: {
        themeID: this.topicID,
        coverage: coverage[0]
      },
      disableClose: true,
      panelClass: 'full-dialog'
    }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        const solution = reply.solutions[0];
        this.solutions.unshift(solution);
        this.dataSource = new MatTableDataSource(this.solutions);
      }
    });
  }

  popCitizensWall(type: string) {
    this.router.navigateByUrl('/posts', {
      state:
        { topic: this.topicID, load: type }
    });
  }
}
