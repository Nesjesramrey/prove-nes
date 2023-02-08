import { Component, OnInit, EventEmitter } from '@angular/core';
import { ThemeVariables, ThemeRef, lyl, StyleRenderer } from '@alyle/ui';
import { NavigationEnd, ResolveStart, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { CompleteRegistrationComponent } from './components/complete-registration/complete-registration.component';
import { environment } from 'src/environments/environment';
import { SocketService } from './services/socket.service';
import { filter, Observable } from 'rxjs';
import { DocumentService } from './services/document.service';
import { response } from 'express';
import { DeviceDetectorService } from 'ngx-device-detector';
import { trigger, transition, animate, style } from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
    }`,
  };
};

declare const gtag: Function;

@Component({
  selector: '.app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [StyleRenderer],
})
export class AppComponent implements OnInit {
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  public isDataAvailable: boolean = false;
  public user: any = null;
  public accessToken: any = null;
  public socketID: any = null;
  public path: any = null;
  public coverDocument: any = null;
  public isMobile: boolean = false;
  public open: boolean = false;
  public isProfile: boolean = false;
  public document: any = null;
  public openProfileMenu = new EventEmitter<any>();

  constructor(
    readonly sRenderer: StyleRenderer,
    public router: Router,
    public authenticationSrvc: AuthenticationService,
    public userService: UserService,
    public utilityService: UtilityService,
    public dialog: MatDialog,
    public socketService: SocketService,
    public documentService: DocumentService,
    public deviceDetectorService: DeviceDetectorService,
    public angularFireAuth: AngularFireAuth
  ) {
    this.accessToken = this.authenticationSrvc.fetchAccessToken;
    this.router.events.subscribe((val) => {
      if (val instanceof ResolveStart) {
        this.path = val.url;
      }
    });
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
    console.log('Project version', environment.version);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects,
        });
      });

    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => {},
      next: (reply: any) => {
        this.coverDocument = reply;
      },
      complete: () => {},
    });

    if (this.accessToken != null) {
      this.userService.fetchFireUser().subscribe({
        error: (error) => {
          switch (error['status']) {
          }
          setTimeout(() => {
            this.isDataAvailable = true;
          });
        },
        next: (reply: any) => {
          this.user = reply;
          this.isDataAvailable = true;

          if (!this.user['isFullRegister']) {
            this.openCompleteRegistration();
          }
        },
        complete: () => {},
      });
    } else {
      setTimeout(() => {
        this.isDataAvailable = true;
      });
    }

    this.documentService.fetchCoverDocument().subscribe({
      error: (error: any) => {},
      next: (reply: any) => {
        this.document = reply;
      },
    });
  }

  openCompleteRegistration() {
    const dialogRef = this.dialog.open(CompleteRegistrationComponent, {
      width: '640px',
      data: {
        user: this.user,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
      }
    });
  }

  getMenuStatus(data: any) {
    this.open = data['open'];
  }

  getMenuProfileStatus(data: any) {
    this.isProfile = data['isProfile'];
  }

  linkMe(url: string) {
    switch (url) {
      case 'home':
        this.router.navigateByUrl('/');
        break;

      case 'quienesSomos':
        this.router.navigateByUrl('/#quienesSomos');
        break;

      case 'profile':
        // this.isProfile = !this.isProfile;
        this.router.navigateByUrl('/hub/' + this.user['_id']);
        break;

      case 'documents':
        // this.isProfile = !this.isProfile;
        // this.router.navigateByUrl('/documentos-publicos/' + this.document['_id']);
        this.router.navigateByUrl('/documentos/');
        break;

      case 'complaint':
        // this.isProfile = !this.isProfile;
        this.router.navigateByUrl('/denuncias');
        break;

      case 'testimony':
        // this.isProfile = !this.isProfile;
        this.router.navigateByUrl('/testimonios');
        break;

      case 'associations':
        // this.isProfile = !this.isProfile;
        this.router.navigateByUrl('/asociaciones');
        break;

      case 'configuration':
        // this.isProfile = !this.isProfile;
        this.router.navigateByUrl('/hub/configuracion');
        break;

      case 'entry-point':
        window.open(
          'https://static-assets-pando.s3.amazonaws.com/assets/punto-de-partida.pdf'
        );
        break;
    }

    this.open = !this.open;
  }

  onHome() {
    this.open = !this.open;
    setTimeout(() => {
      return this.angularFireAuth.signOut().then(() => {
        this.router.navigateByUrl('/');
      });
    }, 100);
  }

  onSignOut() {
    this.open = !this.open;
    setTimeout(() => {
      return this.angularFireAuth.signOut().then(() => {
        localStorage.removeItem('accessToken');
        if (this.path == '/') {
          window.location.reload();
        } else {
          this.router.navigateByUrl('/', { state: { status: 'reload' } });
        }
      });
    }, 300);
  }

  displayProfileMenu() {
    this.isProfile = !this.isProfile;
    this.openProfileMenu.emit({ open: this.isProfile });
  }
}
