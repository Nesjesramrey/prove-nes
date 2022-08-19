import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateSupportGuard implements CanActivate {
  public access: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (this.authenticationService.isAuthenticated) {
    //   this.access = true;
    // } else {
    //   this.router.navigate(['/'], {});
    //   this.access = false;
    // }
    return this.access;
  }
}
