import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'src/app/services/layout.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.subcategory-page',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';

  public document: any = null;
  public category: any;
  public subcategory: any = null;

  public isDataAvailable: boolean = false;

  public displayedColumns: string[] = ['name', 'ranking', 'users'];
  public topicsDataSource = [];
  public solutionsDataSource = [];
  public image : string = '../../../assets/images/not_fount.jpg';

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

    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById(
      {
        _id: this.subcategoryID,
      }
    );

    forkJoin([document, category, subcategory]).subscribe((reply: any) => {
      this.document = reply[0];
      this.category = reply[1];
      this.subcategory = reply[2];
      this.image = (reply[1].images.length > 0) ? reply[1].images[0] : this.image;
      this.topicsDataSource = this.subcategory.topics;
      this.solutionsDataSource = this.subcategory.topics.map(
        (item: any) => [...item.solutions]
      )[0];

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 300);
    });
  }

  redirect(id: string) {
    const path = `documentos-publicos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/tema/${id}`;

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
