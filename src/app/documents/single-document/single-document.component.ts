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
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { DescriptionViewerComponent } from 'src/app/components/description-viewer/description-viewer.component';

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
  public actionControlActivityList: any[] = [];
  public accesibleLayouts: any[] = [];
  public userCoverageObj: any[] = [];
  public userCoverageStr: any[] = [];

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
    this.actionControlActivityList = this.utilityService.actionControlActivityList;

    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let user: Observable<any> = this.userService.fetchFireUser();
    let acl: Observable<any> = this.documentService.fetchAccessControlList({ document_id: this.documentID });

    forkJoin([document, user, acl]).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        // console.log(reply);
        this.document = reply[0];
        // console.log('document: ', this.document);
        this.user = reply[1];
        this.user['activityName'] = this.user['activities'][0]['value'];
        // console.log('user: ', this.user);

        switch (this.user['activityName']) {
          case 'editor':
            this.layouts = reply[2]['layouts'];
            this.layouts.filter((layout: any) => { layout['access'] = true; });
            this.document['coverage'].filter((x: any) => { x['enabled'] = true; });
            break;

          case 'administrator':
            this.layouts = this.document['layouts'];
            this.layouts.filter((layout: any) => { layout['access'] = true; });
            break;

          case 'citizen':
            this.layouts = reply[2]['layouts'];
            this.layouts.filter((x: any) => { x['states'].length == 0 ? x['access'] = false : x['access'] = true; });
            this.accesibleLayouts = this.layouts.filter((x: any) => { return x['states'].length != 0; });

            this.accesibleLayouts.filter((x: any) => {
              x['states'].filter((y: any) => { this.userCoverageObj.push(y); });
            });

            this.userCoverageObj.filter((x: any) => { this.userCoverageStr.push(x['id']); });

            this.document['coverage'].filter((x: any) => {
              x['enabled'] = false;
              if (this.userCoverageStr.includes(x['_id'])) { x['enabled'] = true; }
            });
            break;
        }
        this.dataSource = new MatTableDataSource(this.layouts);
        // console.log('layouts: ', this.layouts);

        this.collaborators = this.document['collaborators'];
        this.collaborators = this.collaborators.filter((value: any, index: any, self: any) =>
          index === self.findIndex((t: any) =>
            (t['user']['_id'] === value['user']['_id']))
        );
        // console.log('collaborators: ', this.collaborators);
      },
      complete: () => {
        setTimeout(() => {
          this.isDataAvailable = true;
        }, 1000);
      }
    });
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
        if (this.user['activityName'] == 'administrator') {
          this.layouts.push(reply[0]);
          this.layouts.filter((layout: any) => { layout['access'] = true; });
          this.dataSource = new MatTableDataSource(this.layouts);
        } else {
          this.documentService.fetchAccessControlList({ document_id: this.documentID })
            .subscribe({
              error: (error: any) => {
                window.location.reload();
              },
              next: (reply: any) => {
                this.layouts = [];
                this.layouts = reply['layouts'];
                this.layouts.filter((layout: any) => { layout['access'] = true; });
              },
              complete: () => {
                this.dataSource = new MatTableDataSource(this.layouts);
              }
            });
        }

      }
    });
  }

  popAddDocumentCollaborator() {
    const dialogRef = this.dialog.open<AddDocumentCollaboratorComponent>(AddDocumentCollaboratorComponent, {
      width: '640px',
      data: {
        document: this.document,
        user: this.user,
        location: 'document'
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

  popAddCommentsDialog() {
    const dialogRef = this.dialog.open<AddCommentsComponent>(AddCommentsComponent, {
      width: '640px',
      data: {
        location: 'document',
        document: this.document
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

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

  popDescriptionViewerDialog() {
    const dialogRef = this.dialog.open<DescriptionViewerComponent>(DescriptionViewerComponent, {
      data: {
        document: this.document,
        user: this.user,
        location: 'document'
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  LinkMe(url: string) {
    this.utilityService.linkMe(url);
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
        location: 'document',
        document: this.document,
        user: this.user
      },
      disableClose: true,
      panelClass: 'viewer-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  killLayout(layout: any) {
    const dialogRef = this.dialog.open<WindowAlertComponent>(WindowAlertComponent, {
      width: '420px',
      data: {
        windowType: 'kill-layout',
        layout: layout
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.layouts = this.layouts.filter((x: any) => { return x['_id'] != reply['_id']; });
        this.dataSource = new MatTableDataSource(this.layouts);
      }
    });
  }
}
