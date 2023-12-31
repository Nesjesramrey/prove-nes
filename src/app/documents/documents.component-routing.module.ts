import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { SingleDocumentComponent } from './single-document/single-document.component';
import { SingleCategoryComponent } from './single-category/single-category.component';
import { SingleThemeComponent } from './single-theme/single-theme.component';
import { SingleSubcategoryComponent } from './single-subcategory/single-subcategory.component';
import { SingleSolutionComponent } from './single-solution/single-solution.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: DocumentsComponent },
      { path: ':documentID', component: SingleDocumentComponent, canActivate: [] },
      { path: ':documentID/categoria/:categoryID', component: SingleCategoryComponent, canActivate: [] },
      { path: ':documentID/categoria/:categoryID/subcategoria/:subcategoryID', component: SingleSubcategoryComponent, canActivate: [] },
      { path: ':documentID/categoria/:categoryID/subcategoria/:subcategoryID/temas/:themeID', component: SingleThemeComponent, canActivate: [] },
      { path: ':documentID/categoria/:categoryID/subcategoria/:subcategoryID/temas/:themeID/solucion/:solutionID', component: SingleSolutionComponent, canActivate: [] },
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class DocumentsComponentRoutingModule { }
