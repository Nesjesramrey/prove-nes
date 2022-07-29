import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EndPointService } from './endpoint.service';

@Injectable()
export class SupportService {
  public supportMsgSubject = new Subject<any>();

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  injectSupportMsg(msg: any) {
    this.supportMsgSubject.next(msg);
  }

  clearSupportMsg() {
    this.supportMsgSubject.next({});
  }

  getSupportMsg(): Observable<any> {
    return this.supportMsgSubject.asObservable();
  }

  sendSupportMessage(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.sendSupportMessageEndPoint, data);
  }

  injectConversationMessage(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.injectConversationMessageEndPoint, data);
  }

  fetchSupportConversations() {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSupportConversationsEndPoint, {});
  }

  killSupportConversation(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.killSupportConversationEndPoint, data);
  }
}
