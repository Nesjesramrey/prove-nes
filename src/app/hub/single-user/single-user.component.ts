import { LyDialog } from '@alyle/ui/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AddDocumentDialogComponent } from 'src/app/components/add-document-dialog/add-document-dialog.component';
import { SetAvatarDialogComponent } from 'src/app/components/set-avatar-dialog/set-avatar-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '.single-user-page',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss']
})
export class SingleUserComponent implements OnInit {
  public userID: string = '';
  public isDataAvailable: boolean = false;
  public isAuthenticated: boolean = false;
  public token: any = null;
  public user: any = null;
  public userActivities: any = [];
  public documents: any = [];
  public haveRootPermissions: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public dialog: LyDialog,
    public authenticationSrvc: AuthenticationService,
    public userSrvc: UserService,
    public documentSrvc: DocumentService
  ) {
    this.userID = this.activatedRoute['snapshot']['params']['userID'];
    this.isAuthenticated = this.authenticationSrvc['isAuthenticated'];
    this.token = this.authenticationSrvc.fetchToken;
  }

  ngOnInit(): void {
    this.userSrvc.fetchUserById({ _id: this.userID }).subscribe((reply: any) => {
      this.user = reply['user'];
      this.user['activities'].filter((x: any) => { this.userActivities.push(x['value']); });

      // root activities
      if (this.userActivities.length != 0) {
        this.haveRootPermissions = true;

        // moderator
        if (this.userActivities.includes('moderator')) {
          setTimeout(() => {
            this.isDataAvailable = true;
          });
        }
        // administrator
        if (this.userActivities.includes('administrator')) {
          let documents: Observable<any> = this.documentSrvc.fetchMyDocuments({ created_by: this.userID });
          forkJoin([documents]).subscribe((reply: any) => {
            this.documents = reply[0]['documents'];

            setTimeout(() => {
              this.isDataAvailable = true;
            });
          });
        }
      }
      // inner activities
      else {
        this.haveRootPermissions = false;

        this.documentSrvc.fetchEditorDocuments({ userID: this.userID }).subscribe((reply: any) => {
          this.documents = reply['documents'];

          setTimeout(() => {
            this.isDataAvailable = true;
          });
        });
      }
    });
  }

  openAddDocumentDialog() {
    const dialogRef = this.dialog.open<AddDocumentDialogComponent>(AddDocumentDialogComponent, {
      width: 640,
      data: {
        created_by: this.user['_id']
      },
      disableClose: true
    });

    dialogRef.afterClosed.subscribe((reply: any) => {
      if (reply != undefined) {
        this.documents.unshift(reply['document']);
      }
    });
  }

  openCropperDialog(event: Event) {
    const dialogRef = this.dialog.open<SetAvatarDialogComponent, Event>(SetAvatarDialogComponent, {
      width: 420,
      data: event,
      disableClose: true
    });

    dialogRef.afterClosed.subscribe((reply: any) => {
      if (reply != undefined) {
        console.log(reply);
      }
    });
  }
}
