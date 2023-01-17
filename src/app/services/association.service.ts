import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';
import { AuthenticationService } from './authentication.service';
import { Subject } from 'rxjs';

@Injectable(
  { providedIn: 'root'}
)
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

  createAssociation(data:any) {
    // let headers = new Headers();
    // this.createAuthorizationHeader(headers);
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.createAssociationEndpoint, data
    );
}

 
}