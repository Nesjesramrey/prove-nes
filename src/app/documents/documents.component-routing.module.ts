import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { SingleDocumentComponent } from './single-document/single-document.component';
import { SingleCategoryComponent } from './single-category/single-category.component';
import { SingleThemeComponent } from './single-theme/single-theme.component';
import { PublicDocumentComponent } from './public-document/public-document.component';
import { SelectedPublicDocumentComponent } from './selected-public-document/selected-public-document.component';
import { CategoryPublicDocumentComponent } from './category-public-document/category-public-document.component';
import { SubcategoryDocumentComponent } from './subcategory-document/subcategory-document.component';
import { SolutionPublicComponent } from './solution-public-document/solution-public.component';
import { TopicPublicComponent } from './topic-public/topic-public.component';
import { ModalPermissionComponent } from '../components/modal-permission/modal-permission.component';
const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: DocumentsComponent },

      {
        path: 'publico/selected',
        component: SelectedPublicDocumentComponent,
      },
      {
        path: 'publico/test-modal',
        component: ModalPermissionComponent,
      },
      {
        path: 'publico/solucion',
        component: SolutionPublicComponent,
      },
      {
        // path: 'publico/tema',
        path: 'publico/:documentID/categoria/:categoryID/subcategoria/:subcategoryID/tema/:themeID',
        component: TopicPublicComponent,
      },
      { path: 'publico/:documentID', component: PublicDocumentComponent },
      {
        path: 'publico/:documentID/categoria/:categoryID',
        component: CategoryPublicDocumentComponent,
      },
      {
        path: 'publico/:documentID/categoria/:categoryID/subcategoria/:subcategoryID',
        component: SubcategoryDocumentComponent,
      },
      {
        path: ':documentID',
        component: SingleDocumentComponent,
        canActivate: [],
      },
      {
        path: ':documentID/categoria/:categoryID',
        component: SingleCategoryComponent,
        canActivate: [],
      },
      {
        path: ':documentID/categoria/:categoryID:/temas/:themeID',
        component: SingleThemeComponent,
        canActivate: [],
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class DocumentsComponentRoutingModule {}
