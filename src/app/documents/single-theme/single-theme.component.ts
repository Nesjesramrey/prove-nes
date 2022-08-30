import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { DocumentService } from '../../services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-single-theme',
  templateUrl: './single-theme.component.html',
  styleUrls: ['./single-theme.component.scss'],
})
export class SingleThemeComponent implements OnInit {
  public documentID: string = '';
  public accessToken: any = null;
  public user: any = null;
  public document: any = null;
  public layout: any = [];
  public isDataAvailable: boolean = false;
  public layouts: any[] = [];
  public themeData: Theme = _mockTheme;
  public imageToUpload: string[] = [];
  public states: any = [];

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
    this.documentService
      .fetchSingleDocumentById({ _id: this.documentID })
      .subscribe((reply: any) => {
        this.document = reply;
        this.layouts = this.document['layouts'];
      });

    if (this.accessToken != null) {
      this.userService.fetchFireUser().subscribe({
        error: (error) => {
          switch (error['status']) {
            case 401:
              break;
          }
          setTimeout(() => {
            this.isDataAvailable = true;
          }, 1000);
        },
        next: (reply: any) => {
          this.user = reply;
          setTimeout(() => {
            this.isDataAvailable = true;
          }, 1000);
        },
        complete: () => {},
      });
    }

    let categories: Observable<any> = this.utilityService.fetchAllCategories();
    let states: Observable<any> = this.utilityService.fetchAllStatesMex();
    forkJoin([categories, states]).subscribe((reply: any) => {
      // console.log(reply);
      this.states = reply[1]['states'];
      // console.log(this.states);
    });
  }

  handleSelectImage(event: any) {
    if (event == null) return;

    const files = (event.target as HTMLInputElement)?.files ?? [];

    if (files?.length > 0) {
      Object.values(files).map((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.imageToUpload.push(reader.result as string);
        };

        reader.readAsDataURL(file);
      });
    }
  }
}

interface Theme {
  title: string;
  description: string;
  images: string[];
}

const _mockTheme: Theme = {
  title: 'Tema principal',
  description: '',
  images: [],
};
