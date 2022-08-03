import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./dashboard/dashboard.component.module').then(m => m.DashboardComponentModule) },
  { path: 'hub', loadChildren: () => import('./hub/hub.component.module').then(m => m.HubComponentModule) },
  { path: 'admin', loadChildren: () => import('./pando/pando.component.module').then(m => m.PandoComponentModule) },
  { path: 'documentos', loadChildren: () => import('./documents/documents.component.module').then(m => m.DocumentsComponentModule) },
  { path: '404', loadChildren: () => import('./not-found/not-found.component.module').then(m => m.NotFoundComponentModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
