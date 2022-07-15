import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: '.app-pagelet',
  templateUrl: './app-pagelet.component.html',
  styleUrls: ['./app-pagelet.component.scss']
})
export class AppPageletComponent implements OnInit {
  public token: any = null;
  @Input('user') public user: any = null;

  constructor(
    public router: Router,
    public authenticationSrvc: AuthenticationService
  ) { }

  ngOnInit(): void { }

  linkMe(url: string) {
    switch (url) {
      case 'home':
        this.router.navigateByUrl('/');
        break;

      case 'login':
        this.router.navigateByUrl('/hub/ingresar');
        break;

      case 'join':
        this.router.navigateByUrl('/hub/registro');
        break;

      case 'profile':
        this.router.navigateByUrl('/hub/' + this.user['_id']);
        break;
    }
  }

  onSignOut() {
    this.token = this.authenticationSrvc.fetchToken;
    let data: any = {
      _id: this.user['_id'],
      token: this.token
    }
    this.authenticationSrvc.signout(data).subscribe((reply: any) => {
      if (reply['status'] == false) {
        // this.utilitySrvc.openErrorSnackBar(reply['error']);
        return;
      }
      localStorage.removeItem('token');
      window.location.reload();
    });
  }
}
