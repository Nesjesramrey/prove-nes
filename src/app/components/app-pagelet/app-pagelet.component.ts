import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.app-pagelet',
  templateUrl: './app-pagelet.component.html',
  styleUrls: ['./app-pagelet.component.scss']
})
export class AppPageletComponent implements OnInit {
  public token: any = null;
  @Input('user') public user: any = null;
  public notifications: any = null;
  public isDataAvailable: boolean = false;
  public userActivities: any = [];

  constructor(
    public router: Router,
    public authenticationSrvc: AuthenticationService,
    public notificationSrvc: NotificationService,
    public socketSrvc: SocketService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.user != null) {
        this.user['activities'].filter((x: any) => { this.userActivities.push(x['value']); });
        let notifications: Observable<any> = this.notificationSrvc.fetchMyNotificationsLength({ user_id: this.user['_id'] });

        forkJoin([notifications]).subscribe((reply: any) => {
          this.notifications = reply[0]['notifications'];

          this.socketSrvc.getNotification().subscribe((reply: any) => {
            if (reply['new_notification'] != undefined) {
              this.notificationSrvc.fetchMyNotificationsLength({ user_id: this.user['_id'] }).subscribe((reply: any) => {
                this.notifications = reply['notifications'];
              });
            }
          });

          this.isDataAvailable = true;
        });
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
    // return this.angularFireAuth.signOut().then(() => {
    //   localStorage.removeItem('accessToken');
    //   localStorage.removeItem('uid');
    // });

    this.token = this.authenticationSrvc.fetchToken;
    let data: any = {
      _id: this.user['_id'],
      token: this.token
    }
    this.authenticationSrvc.signout(data).subscribe((reply: any) => {
      if (reply['status'] == false) {
        this.utilitySrvc.openErrorSnackBar(reply['error']);
        return;
      }
      localStorage.removeItem('token');
      window.location.reload();
    });
  }
}
