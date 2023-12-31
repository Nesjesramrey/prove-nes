import { Component, OnInit, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { GiveEditPermissionComponent } from 'src/app/components/give-edit-permission/give-edit-permission.component';
import { ViewMessageComponent } from 'src/app/components/view-message/view-message.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { AssociationService } from 'src/app/services/association.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AttendComplaintDialogComponent } from '../components/attend-complaint-dialog/attend-complaint-dialog.component';

@Component({
  selector: '.user-notifications-page',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
})
export class UserNotificationsComponent implements OnInit {
  public user: any = null;
  public notifications: any = [];
  public isDataAvailable: boolean = false;
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public authenticationSrvc: AuthenticationService,
    public userSrvc: UserService,
    public associationService: AssociationService,
    public notificationSrvc: NotificationService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public deviceDetectorService: DeviceDetectorService,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) {
      this.class = 'fixmobile';
    }
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userSrvc.fetchFireUser();

    forkJoin([user]).subscribe((reply: any) => {
      this.user = reply[0];
      // console.log('user: ', this.user);
      this.notificationSrvc
        .fetchMyNotificationsContent({ userID: this.user['_id'] })
        .subscribe((reply: any) => {
          this.notifications = reply;
          // console.log(this.notifications);
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
          if (x['_id'] == notification['_id']) {
            notification['viewed'] = true;
          }
        });
        this.notificationSrvc.notificationCountSubject.next({ reload: true });
      },
      complete: () => {},
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
      complete: () => {},
    });
  }

  linkMe(url: string, notification: any) {
    this.markNotificationAsRead(notification);
    this.utilityService.linkMe(url);
  }

  popViewMessageDialog(notification: any) {
    this.markNotificationAsRead(notification);

    const dialogRef = this.dialog.open<ViewMessageComponent>(
      ViewMessageComponent,
      {
        width: '640px',
        data: {
          notification: notification,
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  popGivePermissionsDialog(notification: any) {
    this.markNotificationAsRead(notification);

    const dialogRef = this.dialog.open<GiveEditPermissionComponent>(
      GiveEditPermissionComponent,
      {
        width: '640px',
        data: {
          notification: notification,
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  popNewComplaintDialog(notification: any) {
    this.markNotificationAsRead(notification);

    const dialogRef = this.dialog.open<AttendComplaintDialogComponent>(
      AttendComplaintDialogComponent,
      {
        // width: '640px',
        data: {
          payload: notification['metadata'],
          user: this.user,
        },
        disableClose: true,
        panelClass: 'side-dialog',
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  authorizationJoinAssociation(notification: any) {
    let data: any = {
      association_id: notification['metadata']['association']['_id'],
      user_id: notification['metadata']['user']['_id'], 
    };
    this.associationService.authorizationJoin(data).subscribe({
      error:(err:any) => {
      },
      next: (reply: any)=>{
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: ()=>{}
    })
    
   
  }
}
