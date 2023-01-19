import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAuthenticatedGuard } from '../guards/authenticated.guard';
import { CanActivateLoggedInGuard } from '../guards/logged-in.guard';
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';
import { HubComponent } from './hub.component';
import { SignInMobileComponent } from './sign-in-mobile/sign-in-mobile.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpMobileComponent } from './sign-up-mobile/sign-up-mobile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { UserDocumentsComponent } from './user-documents/user-documents.component';
import { AssociationsComponent } from './associations/associations.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: HubComponent },
      {
        path: 'olvide-contrasena',
        component: PasswordRecoveryComponent,
        canActivate: [CanActivateAuthenticatedGuard],
      },
      {
        path: 'signup-mobile',
        component: SignUpMobileComponent,
        canActivate: [],
      },
      {
        path: 'registro',
        component: SignUpComponent,
        canActivate: [CanActivateAuthenticatedGuard],
      },
      {
        path: 'signin-mobile',
        component: SignInMobileComponent,
        canActivate: [],
      },
      {
        path: 'ingresar',
        component: SignInComponent,
        canActivate: [CanActivateAuthenticatedGuard],
      },
      {
        path: 'notificaciones',
        component: UserNotificationsComponent,
        canActivate: [CanActivateLoggedInGuard],
      },
      {
        path: 'configuracion',
        component: AppConfigurationComponent,
        canActivate: [CanActivateLoggedInGuard],
      },
      {
        path: 'documentos',
        component: UserDocumentsComponent,
        canActivate: [CanActivateLoggedInGuard],
      },
      {
        path: 'configuracion',
        component: AppConfigurationComponent,
        canActivate: [CanActivateLoggedInGuard],
      },
      {
        path: 'asociaciones',
        component: AssociationsComponent,
        canActivate: [CanActivateLoggedInGuard],
      },
      { path: ':userID', component: SingleUserComponent, canActivate: [] },
      
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class HubComponentRoutingModule { }
