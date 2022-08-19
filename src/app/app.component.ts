import { Component, OnInit } from '@angular/core';
import { ThemeVariables, ThemeRef, lyl, StyleRenderer } from '@alyle/ui';
import { NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';

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
  public user: any = null;
  public accessToken: any = null;

  constructor(
    readonly sRenderer: StyleRenderer,
    // public router: Router,
    public authenticationSrvc: AuthenticationService,
    public userService: UserService,
    public utilityServicfe: UtilityService
  ) {
    this.accessToken = this.authenticationSrvc.fetchAccessToken;
    // console.log('accessToken: ', this.accessToken);

    // this.router.events.subscribe((val) => {
    //   if (val instanceof NavigationStart) {
    //     let lastVal: any = val['url'].substring(val['url'].lastIndexOf('/') + 1);
    //     if (lastVal == 'registro') { }
    //   }
    // });
  }

  ngOnInit(): void {
    if (this.accessToken != null) {
      // this.userService.fetchFireUser().subscribe((reply: any) => {
      //   this.user = reply;
      //   setTimeout(() => {
      //     this.isDataAvailable = true;
      //   });
      // });

      this.userService.fetchFireUser().subscribe({
        error: (error) => {
          switch (error['status']) {
            case 401:
              this.utilityServicfe.openErrorSnackBar('Tu token de acceso ha caducado, intenta ingresar otra vez.');
              localStorage.removeItem('accessToken');
              break;
          }
          setTimeout(() => {
            this.isDataAvailable = true;
          });
        },
        next: (reply: any) => {
          this.user = reply;
          console.log(this.user);
          setTimeout(() => {
            this.isDataAvailable = true;
          });
        },
        complete: () => { },
      });
    } else {
      setTimeout(() => {
        this.isDataAvailable = true;
      });
    }
  }
}
