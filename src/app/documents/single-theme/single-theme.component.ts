import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { DocumentService } from '../../services/document.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';

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
  }
}
