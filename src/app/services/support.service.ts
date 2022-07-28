import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointService } from './endpoint.service';

@Injectable()
export class SupportService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  sendSupportMessage(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.sendSupportMessageEndPoint, data);
  }

  fetchSupportConversations() {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchSupportConversationsEndPoint, {});
  }

  killSupportConversation(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.killSupportConversationEndPoint, data);
  }
}
