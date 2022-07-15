import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAuthenticatedGuard } from '../guards/authenticated.guard';
import { HubComponent } from './hub.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SingleUserComponent } from './single-user/single-user.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: HubComponent },
      { path: 'registro', component: SignUpComponent, canActivate: [CanActivateAuthenticatedGuard] },
      { path: 'ingresar', component: SignInComponent, canActivate: [CanActivateAuthenticatedGuard] },
      { path: ':userID', component: SingleUserComponent, canActivate: [] }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class HubComponentRoutingModule { }
