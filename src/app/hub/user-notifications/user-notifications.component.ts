import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '.user-notifications-page',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  public token: any = null;
  public payload: any = null;
  public user: any = null;
  public notifications: any = [];
  public isDataAvailable: boolean = false;

  constructor(
    public authenticationSrvc: AuthenticationService,
    public userSrvc: UserService,
    public notificationSrvc: NotificationService
  ) {
    this.token = this.authenticationSrvc.fetchToken;
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));

      let user: Observable<any> = this.userSrvc.fetchUserById({ _id: this.payload['sub'] });
      let notifications: Observable<any> = this.notificationSrvc.fetchMyNotificationsContent({ user_id: this.payload['sub'] });

      forkJoin([user, notifications]).subscribe((reply: any) => {
        // console.log(reply);
        this.user = reply[0]['user'];
        // console.log(this.user);
        this.notifications = reply[1]['notifications'];
        console.log(this.notifications);
        this.isDataAvailable = true;
      });
    } else {
      this.isDataAvailable = true;
    }
  }
}
