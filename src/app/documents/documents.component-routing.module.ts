import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { SingleDocumentComponent } from './single-document/single-document.component';
import { SingleCategoryComponent } from './single-category/single-category.component';
import { SingleThemeComponent } from './single-theme/single-theme.component';
import { PublicDocumentComponent } from './public-document/public-document.component';
import { SelectedPublicDocumentComponent } from './selected-public-document/selected-public-document.component';
import { SubcategoryDocumentComponent } from './subcategory-document/subcategory-document.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: DocumentsComponent },
      { path: 'public', component: PublicDocumentComponent, canActivate: [] },
      { path: 'selected-public', component: SelectedPublicDocumentComponent, canActivate: [] },
      { path: 'subcategory', component: SubcategoryDocumentComponent, canActivate: [] },
      { path: ':documentID', component: SingleDocumentComponent, canActivate: [] },
      { path: ':documentID/categoria/:categoryID', component: SingleCategoryComponent, canActivate: [] },
      { path: ':documentID/categoria/:categoryID:/temas/:themeID', component: SingleThemeComponent, canActivate: [] }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class DocumentsComponentRoutingModule { }
