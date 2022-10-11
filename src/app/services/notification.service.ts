import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class NotificationService {
  public notificationCountSubject!: BehaviorSubject<any>;

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) {
    this.notificationCountSubject = new BehaviorSubject<any>(null);
  }

  createNewNotification(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.createNewNotificationEndPoint, data);
  }

  fetchMyNotificationsLength(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchMyNotificationsLengthEndPoint, data);
  }

  fetchMyNotificationsContent(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchMyNotificationsContentEndPoint + `?message_to=${data['userID']}`, data);
  }

  fetchMyNotificationUnread(data: any) {
    return this.httpClient.get(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchMyNotificationUnreadEndPoint + `${data['userID']}`, data);
  }

  markAsReadNotification(data: any) {
    return this.httpClient.put(this.endpointSrvc.apiEndPoint + this.endpointSrvc.markAsReadNotificationEndPoint + `${data['notification_id']}` + '/mark_as_read', data);
  }

  killNotification(data: any) {
    return this.httpClient.delete(this.endpointSrvc.apiEndPoint + this.endpointSrvc.killNotificationEndPoint + `${data['notification_id']}`, data);
  }
}
