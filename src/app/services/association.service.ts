import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssociationService {
  public accessToken: any = null;

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService,
    public authenticationService: AuthenticationService
  ) {
    // console.log(this.accessToken);
  }

  // createAuthorizationHeader(headers: Headers) {
  //   headers.append('Authorization', 'Bearer ' + this.accessToken);
  // }

  createAssociation(data: any) {
    // let headers = new Headers();
    // this.createAuthorizationHeader(headers);
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.createAssociationEndpoint,
      data
    );
  }

  fetchAssociationById(data: any) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.fetchAssociationByIdEndPoint +
        `${data}`,
      {}
    );
  }

  searchAssociation(name: string) {
    return this.httpClient.get(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.searchAssociationEndpoint +
        name
    );
  }

  authorizationJoin(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.authorizationAssociationEndpoint +
        `${data['association_id']}` +
        '/validate_request/user/'+
        `${data['user_id']}`,
        {}
    );
  }

  uploadAvatarImageEndPoint(data: any) {
    return this.httpClient.put(
      this.endpointSrvc.apiEndPoint +
        this.endpointSrvc.uploadAvatarAssociationImageEndPoint +
        `${data['association_id']}`,
      data['formData']
    );
  }
}
