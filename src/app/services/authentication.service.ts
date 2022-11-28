import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointService } from './endpoint.service';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UtilityService } from './utility.service';

@Injectable()
export class AuthenticationService {
  public token_key: string = 'token';
  public isNewUser: string = 'isNewUser';
  public accessToken: string = 'accessToken';
  public uid: string = 'uid';

  constructor(
    public httpClient: HttpClient,
    public endpointSrvc: EndPointService,
    public angularFireStore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    public ngZone: NgZone,
    public utilityService: UtilityService
  ) {
    // this.angularFireAuth.idToken.subscribe({
    //   next(value) {
    //     console.log("IDToken:", value);
    //   },
    // })
    // this.angularFireAuth.idTokenResult.subscribe({
    //   next(value) {
    //     console.log("IDTokenResult:", value);
    //   },
    // });
    // this.angularFireAuth.user.subscribe({
    //   next(value) {
    //     console.log("RefreshToken", value?.refreshToken);
    //   },
    // });
  }

  getCurrenUser() {
    setTimeout(() => {
      this.angularFireAuth.currentUser.then((a) => console.log(a));
    }, 1000);
  }

  currentUser() {
    return new Observable<firebase.default.User | null>((observer) => {
      setTimeout(() => {
        this.angularFireAuth.currentUser.then((value) => {
          observer.next(value);
          observer.complete();
        });
      }, 800);
    });
  }

  refreshToken(user: firebase.default.User | null) {
    return new Observable<firebase.default.auth.IdTokenResult | null>(
      (observer) => {
        if (!user) {
          observer.error(new Error('user not found'));
        } else {
          user.getIdTokenResult(true).then((a) => {
            observer.next(a);
            observer.complete();
          });
        }
      }
    ).pipe(
      tap((value) => {
        if (value) localStorage.setItem('accessToken', value.token);
      })
    );
  }

  firebaseSignup(email: string, password: string) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result: any) => {
        // console.log(result);
        console.log(result['user']['uid']);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  firebaseSignIn(email: string, password: string) {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // console.log(result);
        this.angularFireAuth.authState.subscribe((user) => {
          if (user) {
            // console.log(user);
          }
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  forgotPassword(email: string) {
    return this.angularFireAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.utilityService.openSuccessSnackBar(
          'Se ha enviado un correo para cambio de contraseña, revisa tu bandeja de entrada.'
        );
      })
      .catch((error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
      });
  }

  validateEmail(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.validateEmailEndPoint,
      data
    );
  }

  signin(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.signinEndPoint,
      data
    );
  }

  signup(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.signupEndPoint,
      data
    );
  }

  /**
   * @deprecated
   * @param data
   * @returns
   */
  signout(data: any) {
    return this.httpClient.post(
      this.endpointSrvc.apiEndPoint + this.endpointSrvc.signoutEndPoint,
      data
    );
  }

  signoutv2(): any {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('accessToken');
      window.location.reload();
    });
  }

  set setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get fetchAccessToken() {
    return localStorage.getItem(this.accessToken);
  }

  get fetchToken() {
    return localStorage.getItem(this.token_key);
  }

  get isAuthenticated() {
    // return !!localStorage.getItem(this.token_key);
    return !!localStorage.getItem(this.accessToken);
  }

  get isNew() {
    return localStorage.getItem(this.isNewUser);
  }

  killToken() {
    localStorage.removeItem(this.token_key);
  }
}
