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
    let user: Observable<any> = this.userSrvc.fetchFireUser();

    forkJoin([user]).subscribe((reply: any) => {
      // console.log(reply);
      this.user = reply[0];
      // console.log('user: ', this.user);

      this.notificationSrvc.fetchMyNotificationsContent({ userID: this.user['_id'] })
        .subscribe((reply: any) => {
          // console.log(reply);
          this.notifications = reply;
        });

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
    });
  }
}
