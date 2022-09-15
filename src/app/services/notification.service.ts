import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';

@Injectable()
export class NotificationService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

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
}
