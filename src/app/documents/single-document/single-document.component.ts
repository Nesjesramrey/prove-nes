import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentCategoryComponent } from 'src/app/components/add-document-category/add-document-category.component';
import { AddDocumentCollaboratorComponent } from 'src/app/components/add-document-collaborator/add-document-collaborator.component';
import { AddDocumentLayoutComponent } from 'src/app/components/add-document-layout/add-document-layout.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: '.single-document-page',
  templateUrl: './single-document.component.html',
  styleUrls: ['./single-document.component.scss']
})
export class SingleDocumentComponent implements OnInit {
  public documentID: string = '';
  public token: any = null;
  public user: any = null;
  public payload: any = null;
  public document: any = null;
  public layout: any = [];
  public isDataAvailable: boolean = false;
  public displayedColumns: string[] = ['select', 'name', 'email', 'activities', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.token = this.authenticationService.fetchToken;
    // console.log(this.documentID);
  }

  ngOnInit(): void {
    // user available
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));
      let user: Observable<any> = this.userService.fetchUserById({ _id: this.payload['sub'] });
      let document: Observable<any> = this.documentService.fetchSingleDocumentById({ document_id: this.documentID });
      forkJoin([user, document]).subscribe((reply: any) => {
        // console.log(reply);
        this.user = reply[0]['user'];
        this.document = reply[1]['document'];
        // console.log(this.document);
        this.layout = this.document['layout'];
        console.log(this.layout);

        setTimeout(() => {
          this.dataSource = new MatTableDataSource(this.layout);
          this.isDataAvailable = true;
        });
      });
    }
    // no user available
    else {
      let document: Observable<any> = this.documentService.fetchSingleDocumentById({ document_id: this.documentID });
      forkJoin([document]).subscribe((reply: any) => {
        // console.log(reply);
        this.document = reply[0]['document'];

        setTimeout(() => {
          this.isDataAvailable = true;
        });
      });
    }
  }

  popAddDocumentCategory() {
    const dialogRef = this.dialog.open<AddDocumentCategoryComponent>(AddDocumentCategoryComponent, {
      width: '640px',
      data: {
        documentID: this.documentID,
        document: this.document
      },
      disableClose: true
    });

    // const dialogRef = this.dialog.open<AddDocumentLayoutComponent>(AddDocumentLayoutComponent, {
    //   width: '640px',
    //   data: {
    //     documentID: this.documentID,
    //     document: this.document
    //   },
    //   disableClose: true
    // });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popAddDocumentCollaborator() {
    const dialogRef = this.dialog.open<AddDocumentCollaboratorComponent>(AddDocumentCollaboratorComponent, {
      width: '640px',
      data: {
        documentID: this.documentID,
        document: this.document
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popAddDocumentLayout() { }
}
