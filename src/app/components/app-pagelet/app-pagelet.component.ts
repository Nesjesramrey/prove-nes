import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { UtilityService } from 'src/app/services/utility.service';

// btn
import { MatDialog } from '@angular/material/dialog';
import { ModalPermissionsComponent } from 'src/app/public-documents/components/modal-permissions/modal-permissions.component';

@Component({
  selector: '.app-pagelet',
  templateUrl: './app-pagelet.component.html',
  styleUrls: ['./app-pagelet.component.scss'],
})
export class AppPageletComponent implements OnInit {
  public token: any = null;
  @Input('user') public user: any = null;
  public notifications: any = null;
  public isDataAvailable: boolean = false;
  public userActivities: any = [];
  public path: any;
  public unreadNotifications: any = null;
  public permission: any;

  constructor(
    public router: Router,
    public authenticationSrvc: AuthenticationService,
    public notificationSrvc: NotificationService,
    public socketSrvc: SocketService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth,

    public dialog: MatDialog
  ) {
    if (this.router.url.indexOf('documentos-publicos') !== -1) {
      this.path = this.router.url.indexOf('documentos-publicos');
    }
    this.token = this.authenticationSrvc.fetchAccessToken;
  }

  ngOnInit(): void {
    console.log({ user: this.user });

    setTimeout(() => {
      this.checkPermission();
      if (this.user != null) {
        this.user['activities'].filter((x: any) => {
          this.userActivities.push(x['value']);
        });
        // let notifications: Observable<any> = this.notificationSrvc.fetchMyNotificationsLength({ user_id: this.user['_id'] });

        this.notificationSrvc
          .fetchMyNotificationUnread({ userID: this.user['_id'] })
          .subscribe((reply: any) => {
            this.unreadNotifications = reply['count'];
          });

        // this.socketSrvc.putNotification({
        //   message: 'hello world',
        //   message_to: this.user['_id']
        // });

        // this.socketSrvc.getNotification().subscribe((reply: any) => {
        //   console.log(reply);
        // });

        // forkJoin([notifications]).subscribe((reply: any) => {
        //   this.notifications = reply[0]['notifications'];
        //   this.socketSrvc.getNotification().subscribe((reply: any) => {
        //     if (reply['new_notification'] != undefined) {
        //       this.notificationSrvc.fetchMyNotificationsLength({ user_id: this.user['_id'] }).subscribe((reply: any) => {
        //         this.notifications = reply['notifications'];
        //       });
        //     }
        //   });
        //   this.isDataAvailable = true;
        // });
        this.isDataAvailable = true;
      } else {
        this.isDataAvailable = true;
      }
    });
  }

  linkMe(url: string) {
    switch (url) {
      case 'home':
        this.router.navigateByUrl('/');
        break;

      case 'login':
        this.router.navigateByUrl('/hub/ingresar');
        break;

      case 'join':
        this.router.navigateByUrl('/hub/registro');
        break;

      case 'profile':
        this.router.navigateByUrl('/hub/' + this.user['_id']);
        break;

      case 'notifications':
        this.router.navigateByUrl('/hub/notificaciones');
        break;

      case 'userList':
        this.router.navigateByUrl('/admin/usuarios');
        break;
    }
  }

  onSignOut() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('accessToken');
      this.router.navigateByUrl('/', { state: { status: 'logout' } });
    });
  }
  redirectEdition() {}

  checkPermission() {
    if (this.user.activities[0].value == ('administrator' || 'Editor')) {
      this.permission = true;
    } else {
      this.permission = false;
    }
  }

  btnPermissions() {
    console.log('token', this.token);
    const dialogRef = this.dialog.open<ModalPermissionsComponent>(
      ModalPermissionsComponent,
      {
        width: '640px',
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      console.log('cerrando modal');
    });
  }
}
