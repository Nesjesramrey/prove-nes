import { LyDialog } from '@alyle/ui/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AddDocumentDialogComponent } from 'src/app/components/add-document-dialog/add-document-dialog.component';
import { SetAvatarDialogComponent } from 'src/app/components/set-avatar-dialog/set-avatar-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.single-user-page',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss']
})
export class SingleUserComponent implements OnInit {
  public userID: string = '';
  public isDataAvailable: boolean = false;
  public isAuthenticated: boolean = false;
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
    public documentSrvc: DocumentService,
    public utilityService: UtilityService
  ) {
    this.userID = this.activatedRoute['snapshot']['params']['userID'];
    this.isAuthenticated = this.authenticationSrvc['isAuthenticated'];
  }

  ngOnInit(): void {
    this.userSrvc.fetchFireUser().subscribe((reply: any) => {
      // console.log(reply);
      this.user = reply;
      // console.log('user: ', this.user);
      this.user['activities'].filter((x: any) => { this.userActivities.push(x['value']); });
      // console.log(this.userActivities);
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
          let documents: Observable<any> = this.documentSrvc.fetchMyDocuments({ createdBy: this.userID });
          forkJoin([documents]).subscribe((reply: any) => {
            // console.log(reply);
            this.documents = reply[0];
            console.log('documents: ', this.documents);
            setTimeout(() => {
              this.isDataAvailable = true;
            });
          });
          // let documents: Observable<any> = this.documentSrvc.fetchMyDocuments({ created_by: this.userID });
          // forkJoin([documents]).subscribe((reply: any) => {
          //   this.documents = reply[0]['documents'];
          // });
        }
      }
    });
    return;

    this.userSrvc.fetchUserById({ _id: this.userID }).subscribe((reply: any) => {
      console.log(reply);
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

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }
}
