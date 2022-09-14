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

@Component({
  selector: '.app-single-subcategory',
  templateUrl: './single-subcategory.component.html',
  styleUrls: ['./single-subcategory.component.scss'],
})
export class SingleSubcategoryComponent implements OnInit {
  public documentID: string = '';
  public categoryID: string = '';
  public subcategoryID: string = '';
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
  public subcategory: any = null;
  public solutions: any[] = [];

  /* TABLE */
  public displayedColumns: string[] = [
    'name',
    'users',
    'interactions',
    'solutions',
    'ranking',
    'actions',
  ];
  //public subcategories: any[] = [];
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
    public solutionService: SolutionService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
    this.subcategoryID = this.activatedRoute['snapshot']['params']['subcategoryID'];
    this.token = this.authenticationService.accessToken;
  }

  ngOnInit(): void {
    let document: Observable<any> = this.documentService.fetchSingleDocumentById({ _id: this.documentID });
    let category: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.categoryID });
    let subcategory: Observable<any> = this.layoutService.fetchSingleLayoutById({ _id: this.subcategoryID });

    forkJoin([document, category, subcategory]).subscribe((reply: any) => {
      this.document = reply[0];
      //console.log('document: ', this.document);
      this.selectedCategory = reply[1];
      this.collaborators = reply[0].collaborators;
      // console.log('category: ', this.selectedCategory);
      //this.subcategories = this.selectedCategory['subLayouts'];
      //console.log('subcategories: ', this.subcategories);
      //this.dataSource = new MatTableDataSource(this.subcategories);
      this.subcategory = reply[2];
      //console.log(this.subcategory);
      this.topics = this.subcategory['topics'];
      // console.log(this.topics);
      this.dataSource = new MatTableDataSource(this.topics);

      // for (let i = 0; i < this.topics.length; i++) {
      //   let sols = this.topics[i].solutions;
      //   for (let j = 0; j < sols.length; j++) {
      //     //this.solutions.push(this.topics[i].solutions[j]);
      //     // console.log("la sol id " + this.topics[i].solutions[j])
      //     let sol: Observable<any> = this.solutionService.fetchSingleSolutionById({ _id: this.topics[i].solutions[j] });
      //     forkJoin([sol]).subscribe((reply: any) => {
      //       // console.log("elreply" + JSON.stringify(reply[0]));
      //       let complete_solution = reply[0];
      //       complete_solution.theme = this.topics[i];
      //       console.log(complete_solution);
      //       this.solutions.push(complete_solution);
      //     })
      //   }
      // }

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 300);
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
    const dialogRef = this.dialog.open<AddDocumentThemeComponent>(AddDocumentThemeComponent, {
      width: '640px',
      data: {
        documentID: this.documentID,
        document: this.document,
        categoryID: this.subcategoryID
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.topics.push(reply);
        this.dataSource = new MatTableDataSource(this.topics);
      }
    });
  }

  popEditCategoryDialog() {
    const dialogRef = this.dialog.open<EditCategoryDataComponent>(EditCategoryDataComponent, {
      width: '640px',
      data: {
        layout: this.subcategory
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.subcategory['description'] = reply['description'];
      }
    });
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
        layout: this.subcategory
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
  _id: string;
  name: string;
  users: string;
  interactions: string;
  solutions: number;
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
const _mockTemas = [
  {
    _id: "adasd",
    name: 'Solución',
    category: 'Categoría',
    subcategory: "subcategoría",
    solutions: "soluciones",
    ranking: "ranking"
  },
]