import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateAdminGuard implements CanActivate {
  public access: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public usersService: UserService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.usersService.fetchFireUser().subscribe({
        error: (error: any) => { },
        next: (reply: any) => {
          let userActivity: string = reply['activities'][0]['value'];
          if (userActivity === 'moderator') {
            resolve(true);
          } else {
            resolve(false);
            this.router.navigate(['/not-found'], {});
          }
        },
        complete: () => { }
      });
    })
  }
}
