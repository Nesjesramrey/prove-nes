import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DocumentService } from '../../services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: '.app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.scss'],
})
export class SingleCategoryComponent implements OnInit {
  public documentID: string = '';
  public token: any = null;
  public user: any = null;
  public payload: any = null;
  public document: any = null;
  public layout: any = [];
  public categoriesDisplayedColumns: string[] = [
    'name',
    'users',
    'interactions',
    'solutions',
    'problems',
    'ranking',
    'actions',
  ];
  public isDataAvailable: boolean = false;
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingRowId: string | null = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.token = this.authenticationService.fetchToken;
  }

  ngOnInit(): void {
    // user available
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));
      let user: Observable<any> = this.userService.fetchUserById({
        _id: this.payload['sub'],
      });
      let document: Observable<any> =
        this.documentService.fetchSingleDocumentById({
          document_id: this.documentID,
        });
      forkJoin([user, document]).subscribe((reply: any) => {
        this.user = reply[0]['user'];
        this.document = reply[1]['document']
        this.layout = this.document['layout'];

        setTimeout(() => {
          this.dataSource = new MatTableDataSource(this.layout);
          this.isDataAvailable = true;
        });
      });
    }
    // no user available
    else {
      let document: Observable<any> =
        this.documentService.fetchSingleDocumentById({
          document_id: this.documentID,
        });
      forkJoin([document]).subscribe((reply: any) => {
        this.document = reply[0]['document'];

        setTimeout(() => {
          this.isDataAvailable = true;
        });
      });
    }
  }
}
