import { Injectable, NgZone } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable()
export class AuthenticationService {
  public token_key: string = 'token';
  public isNewUser: string = 'isNewUser';

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService,
    public angularFireStore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    public ngZone: NgZone
  ) { }

  firebaseSignup(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then((result: any) => {
        console.log(result);
        console.log(result['user']['uid']);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  validateEmail(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.validateEmailEndPoint, data);
  }

  signin(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.signinEndPoint, data);
  }

  signup(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.signupEndPoint, data);
  }

  signout(data: any) {
    return this.httpClient.post(this.endpointSrvc.apiEndPoint + this.endpointSrvc.signoutEndPoint, data);
  }

  get fetchToken() {
    return localStorage.getItem(this.token_key);
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.token_key);
  }

  get isNew() {
    return localStorage.getItem(this.isNewUser);
  }

  killToken() {
    localStorage.removeItem(this.token_key);
  }
}
