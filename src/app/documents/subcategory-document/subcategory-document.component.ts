import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'src/app/services/layout.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.subcategory-document-page',
  templateUrl: './subcategory-document.component.html',
  styleUrls: ['./subcategory-document.component.scss'],
})
export class SubcategoryDocumentComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';

  public document: any = null;
  public category: any;
  public subcategorySelected: any = null;

  public isDataAvailable: boolean = false;

  public displayedColumns: string[] = ['name', 'ranking', 'users'];
  public problemsDataSource = PROBLEMS_DATA;
  public solutionsDataSource = SOLUTIONS_DATA;

  constructor(
    public activatedRoute: ActivatedRoute,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public layoutService: LayoutService,
    public utilityService: UtilityService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID =
      this.activatedRoute['snapshot']['params']['subcategoryID'];
  }

  ngOnInit(): void {
    this.loadSubcategory();
  }

  loadSubcategory() {
    let document: Observable<any> =
      this.documentService.fetchSingleDocumentById({ _id: this.documentID });

    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({
      _id: this.categoryID,
    });

    forkJoin([document, category]).subscribe((reply: any) => {
      this.document = reply[0];
      this.category = reply[1];
      this.subcategorySelected = reply[1].subLayouts.filter(
        (item: any) => item._id === this.subcategoryID
      )[0];

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 300);
    });
  }

  redirect(id: string) {
    const path = `documentos/publico/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${id}`;

    this.utilityService.linkMe(path);
  }
}
export interface DataTable {
  name: string;
  ranking: number;
  users: number;
}

export interface ICategory {
  name: string;
}

const SOLUTIONS_DATA: DataTable[] = [
  { name: 'Solución A', ranking: 10, users: 255 },
  { name: 'Solución A', ranking: 10, users: 255 },
  { name: 'Solución A', ranking: 10, users: 255 },
  { name: 'Solución A', ranking: 10, users: 255 },
];

const PROBLEMS_DATA: DataTable[] = [
  { name: 'Problema A', ranking: 10, users: 255 },
  { name: 'Problema A', ranking: 10, users: 255 },
  { name: 'Problema A', ranking: 10, users: 255 },
  { name: 'Problema A', ranking: 10, users: 255 },
];
