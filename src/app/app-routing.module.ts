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
    path: 'asociaciones', loadChildren: () =>
      import('./associations/associations.component.module').then(module => module.AssociationsComponentModule)
  },
  {
    path: 'legales', loadChildren: () =>
      import('./legal/legal.component.module').then(module => module.LegalComponentModule)
  },
  {
    path: 'search', loadChildren: () =>
      import('./search-results/search-results.component.module').then(module => module.SearchResultsComponentModule)
  },
  {
    path: 'denuncias', loadChildren: () =>
      import('./complaints/complaints.component.module').then(module => module.ComplaintsComponentModule)
  },
  {
    path: 'testimonios', loadChildren: () =>
      import('./testimonials/testimonials.component.module').then(module => module.TestimonialsComponentModule)
  },
  {
    path: 'noticias', loadChildren: () =>
      import('./news/news.component.module').then(module => module.NewsComponentModule)
  },
  {
    path: '404', loadChildren: () =>
      import('./not-found/not-found.component.module').then(module => module.NotFoundComponentModule)
  },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
