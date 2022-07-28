import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateLoggedInGuard } from '../guards/logged-in.guard';
import { PandoComponent } from './pando.component';
import { SupportConversationsComponent } from './support-conversations/support-conversations.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: PandoComponent },
      { path: 'usuarios', component: UsersListComponent, canActivate: [CanActivateLoggedInGuard] },
      { path: 'soporte', component: SupportConversationsComponent, canActivate: [CanActivateLoggedInGuard] },
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class PandoComponentRoutingModule { }
