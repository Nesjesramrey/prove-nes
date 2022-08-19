import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// Variables
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  public accessToken: any = null;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.accessToken = this.authenticationService.fetchAccessToken;
    // console.log(this.accessToken);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.accessToken) return next.handle(req);

    const headers = req.clone(
      { headers: req.headers.set('Authorization', `Bearer ${this.accessToken}`) }
    );
    return next.handle(headers);
  }
}
