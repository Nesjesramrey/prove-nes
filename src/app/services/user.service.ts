import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';

@Injectable()
export class UserService {

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService
  ) { }

  fetchAllUsers() {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllUsersEndPoint, {});
  }

  fetchUserById(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserByIdEndPoint, data);
  }
}
