import { Component, OnInit } from '@angular/core';
import { ThemeVariables, ThemeRef, lyl, StyleRenderer } from '@alyle/ui';
import { NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { forkJoin, Observable } from 'rxjs';
import { Location } from '@angular/common';

const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    $global: lyl`{
      body {
        background-color: ${theme.background.default}
        color: ${theme.text.default}
        font-family: ${theme.typography.fontFamily}
        margin: 0
        direction: ${theme.direction}
      }
    }`,
    root: lyl`{
      display: block
    }`
  };
};

@Component({
  selector: '.app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [StyleRenderer]
})
export class AppComponent implements OnInit {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  public isDataAvailable: boolean = false;
  public isAuthenticated: boolean = false;
  public token: any = null;
  public payload: any = null;
  public user: any = null;
  public uid: any = null;

  constructor(
    readonly sRenderer: StyleRenderer,
    public router: Router,
    public location: Location,
    public authenticationSrvc: AuthenticationService,
    public userService: UserService
  ) {
    this.isAuthenticated = this.authenticationSrvc.isAuthenticated;
    this.token = this.authenticationSrvc.fetchToken;
    this.uid = this.authenticationSrvc.fetchFirebaseUID;

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        let lastVal: any = val['url'].substring(val['url'].lastIndexOf('/') + 1);
        if (lastVal == 'registro') { }
      }
    });
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.payload = JSON.parse(atob(this.token.split('.')[1]));
      let user: Observable<any> = this.userService.fetchUserById({ _id: this.payload['sub'] });
      forkJoin([user]).subscribe((reply: any) => {
        console.log(reply);
        this.user = reply[0]['user'];
        setTimeout(() => {
          this.isDataAvailable = true;
        });
      });

      // let user: Observable<any> = this.userService.fetchUserByFirebaseUID({ firebaseID: this.uid });
      // forkJoin([user]).subscribe((reply: any) => {
      //   console.log(reply);
      //   this
      // });
    } else {
      setTimeout(() => {
        this.isDataAvailable = true;
      });
    }
  }
}
