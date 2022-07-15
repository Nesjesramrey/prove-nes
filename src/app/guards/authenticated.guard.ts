import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateAuthenticatedGuard implements CanActivate {
  public access: boolean = false;

  constructor(
    public authenticationSrvc: AuthenticationService,
    public router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authenticationSrvc.isAuthenticated) {
      this.access = true;
    } else {
      this.router.navigate(['/'], {});
      this.access = false;
    }
    return this.access;
  }
}
