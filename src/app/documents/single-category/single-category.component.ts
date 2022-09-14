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

@Component({
  selector: '.app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.scss'],
})
export class SingleCategoryComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public token: any = null;
  public user: any = null;
  public payload: any = null;
  public document: any = null;
  public layout: any = [];
  // public category: Category = _categories_mock[0];

  public selectedCategory: any = null;
  public isDataAvailable: boolean = false;
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingTitle: boolean = false;
  public imageUrl!: string;
  public collaborators: any = null;
  public topics: any = null;
  public solutions: any = null;

  /* TABLE */
  public displayedColumns: string[] = [
    'name',
    'users',
    'interactions',
    'solutions',
    'problems',
    'actions',
  ];
  public subcategories: any[] = [];

  @ViewChild('titleField') titleField!: ElementRef<HTMLInputElement>;

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
    this.token = this.authenticationService.accessToken;
  }

  ngOnInit(): void {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    // let solutions: Observable<any> = this.solutionService.fetchSingleSolutionById({ _id: this.categoryID });

    forkJoin([document, category]).subscribe((reply: any) => {
      // console.log(reply);
      this.document = reply[0];
      // console.log('document: ', this.document);
      this.selectedCategory = reply[1];
      this.collaborators = reply[0].collaborators;
      // console.log('category: ', this.selectedCategory);
      this.subcategories = this.selectedCategory['subLayouts'];
      this.dataSource = new MatTableDataSource(this.subcategories);
      // console.log('subcategories: ', this.subcategories);

      // let themes: any[] = [];
      // let solutions: any[] = [];
      // for (let i = 0; i < this.subcategories.length; i++) {
      //   for (let j = 0; j < this.subcategories[i].topics.length; j++) {

      //     let topic_service: Observable<any> = this.topicService.fetchSingleTopicById({ _id: this.subcategories[i].topics[j] });
      //     forkJoin([topic_service]).subscribe((reply: any) => {
      //       let topic_obj = reply[0];
      //       topic_obj.subcategory = this.subcategories[i];
      //       themes.push(topic_obj);
      //       for (let k = 0; k < reply[0].solutions.length; k++) {
      //         let solution_service: Observable<any> = this.solutionService.fetchSingleSolutionById({ _id: reply[0].solutions[k] });
      //         forkJoin([solution_service]).subscribe((reply: any) => {
      //           let sol = reply[0];
      //           sol.topic = topic_obj;
      //           sol.subcategory = topic_obj.subcategory;
      //           solutions.push(sol);
      //           //console.log(sol);
      //         })
      //       }

      //     })

      //   }
      // }
      // this.topics = themes;
      // this.solutions = solutions;



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
        layout: this.selectedCategory
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.selectedCategory['description'] = reply['description'];
      }
    });
  }

  linkTopic(id: string, subcategory_id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${subcategory_id}/temas/${id}`)
  }

  linkSubcategory(id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${id}`);
  }

  linkSolution(id: string, subcategory_id: string, theme_id: string) {
    this.utilityService.linkMe(`documentos/${this.documentID}/categoria/${this.categoryID}/subcategoria/${subcategory_id}/temas/${theme_id}/solucion/${id}`)
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

  popAddCommentsDialog() {
    const dialogRef = this.dialog.open<AddCommentsComponent>(AddCommentsComponent, {
      width: '640px',
      data: {
        location: 'category',
        document: this.document
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}



interface Category {
  name: string;
  id: string;
  users: number;
  interactions: number;
  solutions: number;
  problems: number;
  ranking: number;
}

const _categories_mock = [
  {
    name: 'deporte',
    id: 'uuid221a',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
  {
    name: 'derechos humanos',
    id: 'uuid221b',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
  {
    name: 'económico',
    id: 'uuid221c',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
];

const _mockSubcategories = [
  {
    name: 'acceso a la educación',
    id: 'uuid221ssc',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
  {
    name: 'deporte',
    id: 'uuid221src',
    users: 500,
    interactions: 6200,
    solutions: 100,
    problems: 700,
    ranking: 700,
  },
];
