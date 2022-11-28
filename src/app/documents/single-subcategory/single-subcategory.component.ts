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
import { AddDocumentCategoryComponent } from 'src/app/components/add-document-category/add-document-category.component';
// import { FormBuilder, FormGroup } from "@angular/forms";
import { AddDocumentThemeComponent } from '../../components/add-document-theme/add-document-theme.component';
import { ThemeService } from 'ng2-charts';
import { throws } from 'assert';
import { EditCategoryDataComponent } from 'src/app/components/edit-category-data/edit-category-data.component';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { WindowAlertComponent } from 'src/app/components/window-alert/window-alert.component';
import { isArray } from 'util';
import { AddDocumentCollaboratorComponent } from 'src/app/components/add-document-collaborator/add-document-collaborator.component';
import { ViewDocumentCommentsComponent } from 'src/app/components/view-document-comments/view-document-comments.component';
import { DescriptionViewerComponent } from 'src/app/components/description-viewer/description-viewer.component';

@Component({
  selector: '.app-single-subcategory',
  templateUrl: './single-subcategory.component.html',
  styleUrls: ['./single-subcategory.component.scss'],
})
export class SingleSubcategoryComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
  public accessToken: any = null;
  public user: any = null;
  public payload: any = null;
  public document: any = null;
  public layout: any = [];
  public selectedCategory: any = null;
  public isDataAvailable: boolean = false;
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingTitle: boolean = false;
  public imageUrl!: string;
  public collaborators: any = null;
  public topics: any = null;
  public subcategory: any = null;
  public solutions: any[] = [];
  public displayedColumns: string[] = ['name', 'users', 'interactions', 'solutions', 'ranking', 'actions'];
  public subcategories: any[] = [];
  @ViewChild('titleField') titleField!: ElementRef<HTMLInputElement>;
  public actionControlActivityList: any[] = [];
  public accesibleLayouts: any[] = [];
  public userCoverageObj: any[] = [];
  public userCoverageStr: any[] = [];
  public layouts: any = null;
  public coverageSelected: any = null;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService,
    public layoutService: LayoutService,
    public solutionService: SolutionService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.accessToken = this.authenticationService.accessToken;
  }

  ngOnInit(): void {
    this.actionControlActivityList = this.utilityService.actionControlActivityList;

    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID });
    let user: Observable<any> = this.userService.fetchFireUser();
    let acl: Observable<any> = this.documentService.fetchAccessControlList({ document_id: this.documentID });

    forkJoin([document, category, subcategory, user, acl]).subscribe((reply: any) => {
      // console.log(reply);
      this.document = reply[0];
      // console.log('document: ', this.document);
      this.collaborators = this.document['collaborators'];
      this.collaborators = this.collaborators.filter((value: any, index: any, self: any) =>
        index === self.findIndex((t: any) =>
          (t['user']['_id'] === value['user']['_id']))
      );
      // console.log('collaborators: ', this.collaborators);
      this.selectedCategory = reply[1];
      // console.log('category: ', this.selectedCategory);
      this.subcategory = reply[2];
      // console.log('subcategory: ', this.subcategory);
      this.topics = this.subcategory['topics'];
      // console.log('topics: ', this.topics);
      this.dataSource = new MatTableDataSource(this.topics);
      this.user = reply[3];
      this.user['activityName'] = this.user['activities'][0]['value'];
      // console.log('user: ', this.user);
      this.layouts = reply[4]['layouts'];
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
      // console.log(this.layouts);

      switch (this.user['activityName']) {
        case 'editor':
          this.document['coverage'].filter((x: any) => { x['enabled'] = true; });
          break;
      }

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
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
        this.subcategories.push(reply[0]);
        this.dataSource = new MatTableDataSource(this.subcategories);
      }
    });
  }

  popAddDocumentTheme() {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.coverageSelected });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddDocumentThemeComponent>(AddDocumentThemeComponent, {
      // width: '640px',
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: this.subcategoryID,
        coverage: coverage[0]
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        if (reply.hasOwnProperty('topic')) {
          reply['topic']['solutions'] = reply['solutions'];
          this.topics.push(reply['topic']);
        } else {
          this.topics.push(reply);
        }
        this.dataSource = new MatTableDataSource(this.topics);
      }
    });
  }

  popEditCategoryDialog() {
    const dialogRef = this.dialog.open<EditCategoryDataComponent>(EditCategoryDataComponent, {
      // width: '640px',
      data: {
        layout: this.subcategory
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.subcategory['category']['name'] = reply[0]['name'];
        this.subcategory['description'] = reply[1]['description'];
      }
    });
  }

  onSelectCoverage(event: any) {
    this.coverageSelected = event['value'];
  }

  popAddDocumentCollaborator() {
    let coverage = this.document['coverage'].filter((x: any) => { return x['_id'] == this.coverageSelected });
    if (coverage.length == 0) {
      this.utilityService.openErrorSnackBar('Selecciona una cobertura.');
      return;
    }

    const dialogRef = this.dialog.open<AddDocumentCollaboratorComponent>(AddDocumentCollaboratorComponent, {
      width: '640px',
      data: {
        document: this.document,
        layout: this.selectedCategory,
        subLayout: this.subcategory,
        user: this.user,
        topics: this.topics,
        coverage: coverage[0],
        location: 'subLayout'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  linkTopic(id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/temas/${id}`)
  }

  linkSolution(id: string, theme_id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${this.subcategoryID}/temas/${theme_id}/solucion/${id}`)
  }

  popImageViewer() {
    const dialogRef = this.dialog.open<ImageViewerComponent>(ImageViewerComponent, {
      width: '640px',
      data: {
        location: 'layout',
        document: this.document,
        layout: this.subcategory,
        user: this.user
      },
      disableClose: true,
      panelClass: 'viewer-dialog'
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
        location: 'subLayout',
        document: this.document,
        layout: this.subcategory,
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
        location: 'subLayout',
        document: this.document,
        layout: this.subcategory,
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popDescriptionViewerDialog() {
    const dialogRef = this.dialog.open<DescriptionViewerComponent>(DescriptionViewerComponent, {
      data: {
        title: this.subcategory['category']['name'],
        text: this.subcategory['description']
      },
      disableClose: true,
      panelClass: 'full-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  killTopic(topic: any) {
    const dialogRef = this.dialog.open<WindowAlertComponent>(WindowAlertComponent, {
      width: '420px',
      data: {
        windowType: 'kill-topic',
        topic: topic
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        // this.layouts = this.layouts.filter((x: any) => { return x['_id'] != reply['_id']; });
        // this.dataSource = new MatTableDataSource(this.layouts);
      }
    });
  }
}