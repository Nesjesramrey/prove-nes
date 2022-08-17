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
// import { FormBuilder, FormGroup } from "@angular/forms";

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
  public category: Category = _categories_mock[0];

  public isDataAvailable: boolean = false;
  public dataSource = new MatTableDataSource<any>();
  public selection = new SelectionModel<any>(true, []);
  public editingTitle: boolean = false;
  public imageUrl!: string;

  @ViewChild('titleField') titleField!: ElementRef<HTMLInputElement>;

  constructor(
    public activatedRoute: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) {
    this.documentID = this.activatedRoute['snapshot']['params']['documentID'];
    this.categoryID = this.activatedRoute['snapshot']['params']['categoryID'];
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
        this.document = reply[1]['document'];
        this.layout = this.document['layout'];

        this.category = _categories_mock.find(
          (cat) => cat.id === this.categoryID
        )!;

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

  openEditingTitle() {
    this.editingTitle = true;

    setTimeout(() => {
      this.titleField.nativeElement.focus();
    }, 50);
  }

  saveName() {
    this.category.name = this.titleField.nativeElement.value;
    this.editingTitle = false;
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const file = (event.target as HTMLInputElement)?.files![0];
    // this.uploadForm.patchValue({
    //   avatar: file,
    // });
    // this.uploadForm.get('avatar').updateValueAndValidity();
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
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
