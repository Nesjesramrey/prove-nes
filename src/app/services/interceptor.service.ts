import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse, HttpResponseBase, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
import { catchError, mergeMap, Observable, ObservableInput, of, retry, switchMap, tap, throwError } from 'rxjs';


// Variables
import { AuthenticationService } from './authentication.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  public accessToken: any = null;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.accessToken = this.authenticationService.fetchAccessToken;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = this.accessToken ? req.clone({headers: req.headers.set('Authorization', `Bearer ${this.accessToken}`)}) : req; 

    return next.handle(request).pipe(
      catchError((error: HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>) => {  
        if(error instanceof HttpResponseBase) {                    
          switch (error.status) {
            case 401: {
              return this.authenticationService.currentUser().pipe(
                mergeMap(value => this.authenticationService.refreshToken(value)),
                switchMap((value) => {
                  return next.handle(req.clone({headers: req.headers.set('Authorization', `Bearer ${value?.token}`)}));
                }),
                catchError((error) => {
                  this.authenticationService.signoutv2();
                  throw error;                   
                })
              );                   
            }
          }
        }  
    
        throw error; 
      })
    );
  }  
}
