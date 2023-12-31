import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { AuthenticationService } from './authentication.service';
import { catchError, of, Subject, throwError } from 'rxjs';

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
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchFireUserEndPoint, {}
    ).pipe(catchError(error => of(error)));
  }

  fetchAllUsers(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchAllUsersEndPoint + `?limitPerPage=${data['limitPerPage']}&page=${data['page']}`, {}
    ).pipe(catchError(error => of(error)));;
  }

  fetchUserById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserByIdEndPoint + `${data['_id']}`, {}
    );
  }

  passwordRecovery(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.passwordRecoveryEndPoint, data
    );
  }

  fetchUserByFirebaseUID(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserByFirebaseUIDEndPoint, data
    );
  }

  fetchUserCount() {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.fetchUserCountEndPoint, {}
    );
  }

  addUserPermissions(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.addUserPermissionsEndPoint + `${data['userID']}`, data
    );
  }

  uploadAvatarImageEndPoint(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.uploadAvatarImageEndPoint + `${data['user_id']}` + '/profile_picture', data['formData']
    );
  }

  saveLayoutsCategoryPreference(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.saveLayoutsCategoryPreferenceEndPoint + `${data['user_id']}` + '/layout_category_preference', data
    );
  }

  updateProfile(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.addAssociationEndPoint + `${data['user_id']}`, data
    );
  }

  joinUserWithAssociation(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.joinUserWithAssociationEndPoint + `${data['userID']}/association/` + `${data['associationID']}`, {}
    )
  }

  searchUserByEmail(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.searchUserByEmailEndPoint + `?email=${data['email']}`, {}
    );
  }

  uploadUserIDDocument(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.uploadUserIDDocumentEndPoint + `${data['user_id']}` + '/id_picture', data['formData']
    );
  }

  searchInUserList(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.searchInUserListEndPoint + `?filter=${data['filter']}`, {}
    );
  }
}