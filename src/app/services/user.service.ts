import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class UserService {
  public accessToken: any = null;

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService,
    public authenticationService: AuthenticationService
  ) {
    this.accessToken = this.authenticationService.fetchAccessToken;
    // console.log(this.accessToken);
  }

  // createAuthorizationHeader(headers: Headers) {
  //   headers.append('Authorization', 'Bearer ' + this.accessToken);
  // }

  fetchFireUser() {
    // let headers = new Headers();
    // this.createAuthorizationHeader(headers);
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchFireUserEndPoint, {});
  }

  fetchAllUsers() {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllUsersEndPoint, {});
  }

  fetchUserById(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserByIdEndPoint, data);
  }

  fetchUserByFirebaseUID(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserByFirebaseUIDEndPoint, data);
  }

  addUserPermissions(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.addUserPermissionsEndPoint, data);
  }
}
