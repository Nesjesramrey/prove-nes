import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DocumentService } from '../../services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SolutionService } from 'src/app/services/solution.service';
import { TopicService } from 'src/app/services/topic.service';
import { AddDocumentCategoryComponent } from 'src/app/components/add-document-category/add-document-category.component';
// import { FormBuilder, FormGroup } from "@angular/forms";
import { AddDocumentThemeComponent } from '../../components/add-document-theme/add-document-theme.component';
import { EditCategoryDataComponent } from 'src/app/components/edit-category-data/edit-category-data.component';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { WindowAlertComponent } from 'src/app/components/window-alert/window-alert.component';
import { AddDocumentCollaboratorComponent } from 'src/app/components/add-document-collaborator/add-document-collaborator.component';
import { ViewDocumentCommentsComponent } from 'src/app/components/view-document-comments/view-document-comments.component';

@Component({
  selector: '.app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.scss'],
})
export class SingleCategoryComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public accessToken: any = null;
  public user: any = null;
  public payload: any = null;
  public document: any = null;
  public layout: any = [];
  public category: any = null;
  public selectedCategory: any = null;
  public isDataAvailable: boolean = false;
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingTitle: boolean = false;
  public imageUrl!: string;
  public collaborators: any = null;
  public topics: any = null;
  public solutions: any = null;
  public displayedColumns: string[] = ['name', 'users', 'interactions', 'solutions', 'problems', 'actions'];
  public subcategories: any[] = [];
  @ViewChild('titleField') titleField!: ElementRef<HTMLInputElement>;
  public actionControlActivityList: any[] = [];
  public accesibleLayouts: any[] = [];
  public userCoverageObj: any[] = [];
  public userCoverageStr: any[] = [];
  public coverageSelected: any = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService,
    public layoutService: LayoutService,
    public solutionService: SolutionService,
    public topicService: TopicService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.accessToken = this.authenticationService.accessToken;
  }

  ngOnInit(): void {
    this.actionControlActivityList = this.utilityService.actionControlActivityList;

    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    let user: Observable<any> = this.userService.fetchFireUser();
    let acl: Observable<any> = this.documentService.fetchAccessControlList({ document_id: this.documentID });

    forkJoin([document, category, user, acl]).subscribe({
      error: (error: any) => {
        // console.log(error);
        this.utilityService.linkMe('/404');
      },
      next: (reply: any) => {
        // console.log(reply);
        this.document = reply[0];
        // console.log('document: ', this.document);

        this.category = reply[1];
        // console.log('category: ', this.category);

        this.user = reply[2];
        this.user['activityName'] = this.user['activities'][0]['value'];
        // console.log('user: ', this.user);

        this.collaborators = this.document['collaborators'];
        // console.log('collaborators: ', this.collaborators);

        if (!reply[3]['isAdmin']) {
          let selectedCategory = reply[3]['layouts'].filter((x: any) => { return x['id'] == this.categoryID });
          this.selectedCategory = selectedCategory[0];
        } else {
          this.selectedCategory = reply[1];
        }

        // this.selectedCategory = reply[1];
        // console.log('category: ', this.selectedCategory);

        this.subcategories = this.selectedCategory['subLayouts'];
        switch (this.user['activityName']) {
          case 'editor':
            // this.subcategories = reply[2]['layouts'];
            this.subcategories.filter((layout: any) => { layout['access'] = true; });
            this.document['coverage'].filter((x: any) => { x['enabled'] = true; });
            break;

          case 'administrator':
            this.subcategories = this.document['layouts'];
            this.subcategories.filter((layout: any) => { layout['access'] = true; });
            break;

          case 'citizen':
            // this.subcategories = reply[2]['layouts'];
            this.subcategories.filter((x: any) => {
              x['states'].length == 0 ? x['access'] = false : x['access'] = true;
              this.accesibleLayouts = this.subcategories.filter((x: any) => { return x['states'].length != 0; });

              this.accesibleLayouts.filter((x: any) => {
                x['states'].filter((y: any) => { this.userCoverageObj.push(y); });
              });

              this.userCoverageObj.filter((x: any) => { this.userCoverageStr.push(x['id']); });

              this.document['coverage'].filter((x: any) => {
                x['enabled'] = false;
                if (this.userCoverageStr.includes(x['_id'])) { x['enabled'] = true; }
              });
            });
            break;
        }
        this.dataSource = new MatTableDataSource(this.subcategories);
        // console.log('subcategories: ', this.subcategories);
      },
      complete: () => {
        setTimeout(() => {
          this.isDataAvailable = true;
        }, 1000);
      }
    });
  }

  openEditingTitle() {
    this.editingTitle = true;

    setTimeout(() => {
      this.titleField.nativeElement.focus();
    }, 50);
  }

  saveName() {
    this.selectedCategory.name = this.titleField.nativeElement.value;
    this.editingTitle = false;
  }

  onSelectCoverage(event: any) {
    this.coverageSelected = event['value'];
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const file = (event.target as HTMLInputElement)?.files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  handleDeleteProblem(id: string) {
    this.subcategories = this.subcategories.filter((item) => item.id !== id);
  }

  popAddDocumentCategory() {
    const dialogRef = this.dialog.open<AddDocumentCategoryComponent>(AddDocumentCategoryComponent, {
      width: '640px',
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: this.categoryID,
        type: 'sublayout'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
        this.subcategories.push(reply[0]);
        this.dataSource = new MatTableDataSource(this.subcategories);

        this.documentService.fetchAccessControlList({ document_id: this.documentID })
          .subscribe({
            error: (error: any) => {
              window.location.reload();
            },
            next: (reply: any) => {
              let selectedCategory = reply['layouts'].filter((x: any) => { return x['id'] == this.categoryID });
              this.selectedCategory = selectedCategory[0];
              this.subcategories = [];
              this.subcategories = this.selectedCategory['subLayouts'];
              this.subcategories.filter((layout: any) => { layout['access'] = true; });
            },
            complete: () => {
              this.dataSource = new MatTableDataSource(this.subcategories);
            }
          });
      }
    });
  }

  popAddDocumentTheme(subcategoryID: string) {
    const dialogRef = this.dialog.open<AddDocumentThemeComponent>(AddDocumentThemeComponent, {
      width: '640px',
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: subcategoryID
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.selectedCategory.topics.push(reply);
      }
    });
  }

  popEditCategoryDialog() {
    const dialogRef = this.dialog.open<EditCategoryDataComponent>(EditCategoryDataComponent, {
      width: '640px',
      data: {
        layout: this.category
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.selectedCategory['name'] = reply[0]['name'];
        this.category['description'] = reply[1]['description'];
      }
    });
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(ImageViewerComponent, {
      width: '640px',
      data: {
        location: 'layout',
        document: this.document,
        layout: this.selectedCategory
      },
      disableClose: true,
      panelClass: 'viewer-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popAddDocumentCollaborator() {
    const dialogRef = this.dialog.open<AddDocumentCollaboratorComponent>(AddDocumentCollaboratorComponent, {
      width: '640px',
      data: {
        document: this.document,
        layout: this.selectedCategory,
        user: this.user,
        location: 'layout'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popAddCommentsDialog() {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.coverageSelected });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddCommentsComponent>(AddCommentsComponent, {
      width: '640px',
      data: {
        location: 'layout',
        document: this.document,
        layout: this.category,
        coverage: coverage[0]
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popDocumentComments() {
    const dialogRef = this.dialog.open<ViewDocumentCommentsComponent>(ViewDocumentCommentsComponent, {
      data: {
        location: 'layout',
        document: this.document,
        layout: this.category,
      },
      disableClose: true,
      panelClass: 'side-dialog'
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
        this.subcategories = this.subcategories.filter((x: any) => { return x['_id'] != reply['_id']; });
        this.dataSource = new MatTableDataSource(this.subcategories);
      }
    });
  }
}
