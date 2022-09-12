import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentCategoryComponent } from 'src/app/components/add-document-category/add-document-category.component';
import { AddDocumentCollaboratorComponent } from 'src/app/components/add-document-collaborator/add-document-collaborator.component';
import { AddDocumentLayoutComponent } from 'src/app/components/add-document-layout/add-document-layout.component';
import { AddDocumentThemeComponent } from '../../components/add-document-theme/add-document-theme.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UtilityService } from 'src/app/services/utility.service';
import { EditDocumentDataComponent } from 'src/app/components/edit-document-data/edit-document-data.component';
import { AddDocumentCoverTextComponent } from 'src/app/components/add-document-cover-text/add-document-cover-text.component';
import { WindowAlertComponent } from 'src/app/components/window-alert/window-alert.component';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';

@Component({
  selector: '.single-document-page',
  templateUrl: './single-document.component.html',
  styleUrls: ['./single-document.component.scss']
})
export class SingleDocumentComponent implements OnInit {
  public documentID: string = '';
  public accessToken: any = null;
  public user: any = null;
  public document: any = null;
  public layout: any = [];
  public layouts: any[] = [];
  public categoriesDisplayedColumns: string[] = ["name", "users", "interactions", "solutions", "problems", "ranking", "actions"]
  public isDataAvailable: boolean = false;
  public displayedColumns: string[] = ['select', 'name', 'email', 'activities', 'menu'];
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingRowId: string | null = null;
  @ViewChild('editRowName') editRowName!: ElementRef<HTMLInputElement>;
  public collaborators: any = null;
  public published: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService

  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.accessToken = this.authenticationService.fetchAccessToken;
  }

  ngOnInit(): void {
    this.documentService.fetchSingleDocumentById({ _id: this.documentID }).subscribe((reply: any) => {
      this.document = reply;
      // console.log('document: ', this.document);
      this.layouts = this.document['layouts'];
      this.collaborators = this.document.collaborators;
      // console.log('layouts: ', this.layouts);
      this.dataSource = new MatTableDataSource(this.layouts);
    });

    if (this.accessToken != null) {
      this.userService.fetchFireUser().subscribe({
        error: (error) => {
          // console.log(error);
          switch (error['status']) {
            case 401:
              // this.utilityService.openErrorSnackBar('Tu token de acceso ha caducado, intenta ingresar otra vez.');
              // localStorage.removeItem('accessToken');
              break;
          }
          setTimeout(() => {
            this.isDataAvailable = true;
          }, 1000);
        },
        next: (reply: any) => {
          this.user = reply;
          // console.log(this.user);
          setTimeout(() => {
            this.isDataAvailable = true;
          }, 1000);
        },
        complete: () => { },
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

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.layouts.push(reply[0]);
        this.dataSource = new MatTableDataSource(this.layouts);
      }
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

  popAddDocumentTheme(id: string) {
    const dialogRef = this.dialog.open<AddDocumentThemeComponent>(AddDocumentThemeComponent, {
      width: '640px',
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: id,
        type: 'sublayout'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
      }
    });
  }

  popAddDocumentLayout() { }

  popEditDocumentDialog() {
    const dialogRef = this.dialog.open<EditDocumentDataComponent>(EditDocumentDataComponent, {
      width: '640px',
      data: {
        document: this.document
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.document['title'] = reply['title'];
        this.document['description'] = reply['description'];
      }
    });
  }

  popAddCoverTextDialog() {
    const dialogRef = this.dialog.open<AddDocumentCoverTextComponent>(AddDocumentCoverTextComponent, {
      width: '640px',
      data: {
        document: this.document
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.document['coverDescription'] = reply['coverDescription'];
      }
    });
  }

  popWindowAlertDialog() {
    const dialogRef = this.dialog.open<WindowAlertComponent>(WindowAlertComponent, {
      width: '420px',
      data: {
        windowType: 'useAsCover',
        document: this.document
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.document['inCover'] = reply['inCover'];
      }
    });
  }

  linkCategories(id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${id}`)
  }

  setDocumentAsPublicPrivate() {
    this.document['isPublic'] = !this.document['isPublic'];
    let data: any = {
      document_id: this.document['_id'],
      isPublic: this.document['isPublic']
    };

    this.documentService.setDocumentAsPublicPrivate(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar('Oops!... Ocurrió un error, inténtalo más tarde.');
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar('El documento se actualizó correctamente.');
      },
      complete: () => { }
    });
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(ImageViewerComponent, {
      width: '640px',
      data: {
        document: this.document
      },
      disableClose: true,
      panelClass: 'viewer-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
