import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { ViewMessageComponent } from 'src/app/components/view-message/view-message.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.user-notifications-page',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  public user: any = null;
  public notifications: any = [];
  public isDataAvailable: boolean = false;

  constructor(
    public authenticationSrvc: AuthenticationService,
    public userSrvc: UserService,
    public notificationSrvc: NotificationService,
    public utilityService: UtilityService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let user: Observable<any> = this.userSrvc.fetchFireUser();

    forkJoin([user]).subscribe((reply: any) => {
      this.user = reply[0];
      // console.log('user: ', this.user);
      this.notificationSrvc.fetchMyNotificationsContent({ userID: this.user['_id'] })
        .subscribe((reply: any) => {
          this.notifications = reply;
          console.log(this.notifications);
        });

      setTimeout(() => {
        this.isDataAvailable = true;
      }, 1000);
    });
  }

  markNotificationAsRead(notification: any) {
    let data: any = { notification_id: notification['_id'] };
    this.notificationSrvc.markAsReadNotification(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.notifications.filter((x: any) => {
          if (x['_id'] == notification['_id']) { notification['viewed'] = true; }
        });
        this.notificationSrvc.notificationCountSubject.next({ reload: true });
      },
      complete: () => { }
    });
  }

  killNotification(notification: any) {
    let data: any = { notification_id: notification['_id'] };
    this.notificationSrvc.killNotification(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      },
      next: (reply: any) => {
        this.notifications = this.notifications.filter((x: any) => {
          return x['_id'] != notification['_id'];
        });
        this.notificationSrvc.notificationCountSubject.next({ reload: true });
      },
      complete: () => { }
    });
  }

  linkMe(url: string, notification: any) {
    this.markNotificationAsRead(notification);
    this.utilityService.linkMe(url);
  }

  popViewMessageDialog(notification: any) {
    this.markNotificationAsRead(notification);

    const dialogRef = this.dialog.open<ViewMessageComponent>(ViewMessageComponent, {
      width: '640px',
      data: {
        notification: notification
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
