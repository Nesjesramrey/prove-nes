import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () =>
      import('./dashboard/dashboard.component.module').then(m => m.DashboardComponentModule)
  },
  {
    path: 'hub', loadChildren: () =>
      import('./hub/hub.component.module').then(module => module.HubComponentModule)
  },
  {
    path: 'admin', loadChildren: () =>
      import('./pando/pando.component.module').then(module => module.PandoComponentModule)
  },
  {
    path: 'documentos', loadChildren: () =>
      import('./documents/documents.component.module').then(module => module.DocumentsComponentModule)
  },
  {
    path: 'documentos-publicos', loadChildren: () =>
      import('./public-documents/public-documents.component.module').then(module => module.PublicDocumentsModule)
  },
  {
    path: 'legales', loadChildren: () =>
      import('./legal/legal.component.module').then(module => module.LegalComponentModule)
  },
  // {
  //   path: '404', loadChildren: () =>
  //     import('./not-found/not-found.component.module').then(module => module.NotFoundComponentModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
