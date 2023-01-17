import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs';

@Injectable()
export class UserService {
  public accessToken: any = null;
  public onLogin: Subject<any> = new Subject();

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
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchFireUserEndPoint,
      {}
    );
  }

  fetchAllUsers() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllUsersEndPoint,
      {}
    );
  }

  fetchUserById(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserByIdEndPoint,
      data
    );
  }
  passwordRecovery(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint +
      this.endpointSrvc.passwordRecoveryEndPoint,
      data
    );
  }

  fetchUserByFirebaseUID(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint +
      this.endpointSrvc.fetchUserByFirebaseUIDEndPoint,
      data
    );
  }

  fetchUserCount() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserCountEndPoint, {}
    );
  }

  addUserPermissions(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint +
      this.endpointSrvc.addUserPermissionsEndPoint +
      `${data['userID']}`,
      data
    );
  }

  uploadAvatarImageEndPoint(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint +
      this.endpointSrvc.uploadAvatarImageEndPoint +
      `${data['user_id']}` +
      '/profile_picture',
      data['formData']
    );
  }

  saveLayoutsCategoryPreference(data: any) {
    return this.httpClient.put(this.endpointSrvc.apiEndPoint + this.endpointSrvc.saveLayoutsCategoryPreferenceEndPoint + `${data['user_id']}` + '/layout_category_preference', data);
  }

  addAssociation(data: any) {
    return this.httpClient.put(this.endpointSrvc.apiEndPoint + this.endpointSrvc.addAssociationEndPoint + `${data['user_id']}`, data);
  }
}
