import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalPermissionsComponent } from 'src/app/public-documents/components/modal-permissions/modal-permissions.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from 'src/app/services/user.service';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { ComplaintDialogComponent } from '../complaint-dialog/complaint-dialog.component';
import { TestimonyDialogComponent } from '../testimony-dialog/testimony-dialog.component';

@Component({
  selector: '.app-pagelet',
  templateUrl: './app-pagelet.component.html',
  styleUrls: ['./app-pagelet.component.scss'],
})
export class AppPageletComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('path') public path: any = null;
  @Input('coverDocument') public coverDocument: any = null;
  public notifications: any = null;
  public isDataAvailable: boolean = false;
  public userActivities: any = [];
  public isPublic: any;
  public unreadNotifications: any = null;
  public permission: any;
  public redirectUrl: string = '';
  public searchFormGroup!: FormGroup;
  public isMobile: any;
  @Output() public openMenu = new EventEmitter<any>();
  @Input() open: boolean = false;

  constructor(
    public router: Router,
    public authenticationSrvc: AuthenticationService,
    public notificationSrvc: NotificationService,
    public socketSrvc: SocketService,
    public utilitySrvc: UtilityService,
    public angularFireAuth: AngularFireAuth,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public searchService: SearchService,
    public userService: UserService,
    public deviceDetectorService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.reset();
    this.searchFormGroup = this.formBuilder.group({
      search: ['', [Validators.required]],
    });

    setTimeout(() => {
      this.notificationSrvc.notificationCountSubject.subscribe((reply: any) => {
        if (reply != null) {
          if (reply['reload']) {
            this.notificationSrvc
              .fetchMyNotificationUnread({ userID: this.user['_id'] })
              .subscribe((reply: any) => {
                this.unreadNotifications = reply['count'];
              });
          }
        }
      });

      if (this.user) {
        // console.log('user: ', this.user);
        this.user['activities'].filter((x: any) => {
          this.userActivities.push(x['value']);
        });

        this.notificationSrvc
          .fetchMyNotificationUnread({ userID: this.user['_id'] })
          .subscribe((reply: any) => {
            this.unreadNotifications = reply['count'];
          });

        if (['administrator', 'editor'].includes(this.user.activities?.[0]?.value)) {
          this.permission = true;
        } else {
          this.permission = false;
        }

        setTimeout(() => {
          this.isDataAvailable = true;
        });
      } else {
        setTimeout(() => {
          this.isDataAvailable = true;
        });
      }
    });

    this.userService.onLogin.subscribe((data: any) => {
      // console.log('data: ', data);
      this.user = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['path']) this.reset();
  }

  reset() {
    const isDocument = this.router.url.indexOf('documentos');
    this.isPublic = this.router.url.indexOf('documentos-publicos');
    if (this.router.url === '/' || isDocument === -1) {
      this.isPublic = 0;
    }
    this.getRedirectUrl();
  }

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

      case 'notifications':
        this.router.navigateByUrl('/hub/notificaciones');
        break;

      case 'userList':
        this.router.navigateByUrl('/admin/usuarios');
        break;

      case 'complaints':
        this.router.navigateByUrl('/denuncias');
        break;

      case 'testimonials':
        this.router.navigateByUrl('/testimonios');
        break;

      case 'cover-document':
        if (this.user != null) {
          this.router.navigateByUrl('/documentos-publicos/' + this.coverDocument['_id']);
        } else {
          this.router.navigateByUrl('/hub/ingresar');
        }
        break
    }
  }

  onSignOut() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('accessToken');
      if (this.path == '/') {
        window.location.reload();
      } else {
        this.router.navigateByUrl('/', { state: { status: 'reload' } });
      }
    });
  }

  popPermissionsDialog() {
    const dialogRef = this.dialog.open<ModalPermissionsComponent>(
      ModalPermissionsComponent,
      {
        width: '640px',
        data: {
          user: this.user,
        },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((reply: any) => { });
  }

  getRedirectUrl() {
    let params = window.location.pathname.split('/').filter((x) => x);

    this.redirectUrl = params.reduce((acc, cur, index): string => {
      if (
        [
          'documentos',
          'documentos-publicos',
          'categoria',
          'subcategoria',
          'tema',
          'temas',
          'solucion',
        ].includes(cur)
      ) {
        if (cur === 'temas')
          return (acc += '/' + 'tema' + '/' + params[index + 1]);
        if (cur === 'tema')
          return (acc += '/' + 'temas' + '/' + params[index + 1]);
        if (cur === 'documentos-publicos')
          return (acc += '/' + 'documentos' + '/' + params[index + 1]);
        if (cur === 'documentos')
          return (acc += '/' + 'documentos-publicos' + '/' + params[index + 1]);

        return (acc += '/' + cur + '/' + params[index + 1]);
      }
      return acc;
    }, '');
  }

  redirectEdition() {
    this.router.navigateByUrl(this.redirectUrl);
  }

  resetPassword(email: any) {
    this.authenticationSrvc.forgotPassword(email);
  }

  onSearch(formGroup: FormGroup) {
    let data: any = {
      filter: formGroup['value']['search'],
      document_id: this.coverDocument['_id'],
    };
    this.searchService.globalSearch(data).subscribe({
      error: (error: any) => {
        this.utilitySrvc.openErrorSnackBar(this.utilitySrvc.errorOops);
      },
      next: (reply: any) => {
        this.searchService.searchSubject.next(reply);
        this.utilitySrvc.linkMe('/search');
      },
      complete: () => { },
    });
  }

  displayMobileMenu() {
    this.open = !this.open;
    this.openMenu.emit({ open: this.open });
  }

  popSearchDialog() {
    const dialogRef = this.dialog.open<any>(SearchDialogComponent, {
      width: '420px',
      data: {
        document_id: this.coverDocument['_id']
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => { });
  }

  popPDF() {
    window.open('https://static-assets-pando.s3.amazonaws.com/assets/punto+de+partida.pdf');
  }

  popWomenPDF() {
    window.open('https://static-assets-pando.s3.amazonaws.com/assets/mujeres.pdf');
  }

  popComplaintsDialog() {
    const dialogRef = this.dialog.open<any>(ComplaintDialogComponent, {
      width: '100%',
      data: {
        user: this.user
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popTestimonialsDialog() {
    const dialogRef = this.dialog.open<any>(TestimonyDialogComponent, {
      width: '100%',
      data: {
        user: this.user
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
