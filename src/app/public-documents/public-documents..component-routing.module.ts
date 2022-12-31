import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateLoggedInGuard } from '../guards/logged-in.guard';
import { CanActivateVisitGuard } from '../guards/visit-public.guard';
import { CategoryComponent } from './category/category.component';
import { ModalVotesComponent } from './components/modal-votes/modal-votes.component';
import { PublicComponent } from './public/public.component';
import { SelectedCategoryComponent } from './selected-category/selected-category.component';
import { SolutionComponent } from './solution/solution.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { TopicComponent } from './topic/topic.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      {
        path: ':documentID',
        component: PublicComponent,
        canActivate: [CanActivateLoggedInGuard, CanActivateVisitGuard],
      },
      {
        path: ':documentID/categoria/:categoryID',
        component: CategoryComponent,
        canActivate: [CanActivateLoggedInGuard, CanActivateVisitGuard],
      },
      {
        path: ':documentID/categoria/:categoryID/subcategoria/:subcategoryID',
        component: SubcategoryComponent,
        canActivate: [CanActivateLoggedInGuard, CanActivateVisitGuard],
      },
      {
        path: ':documentID/categoria/:categoryID/subcategoria/:subcategoryID/tema/:topicID',
        component: TopicComponent,
        canActivate: [CanActivateLoggedInGuard, CanActivateVisitGuard],
      },
      {
        path: ':documentID/categoria/:categoryID/subcategoria/:subcategoryID/tema/:topicID/solucion/:solutionID',
        component: SolutionComponent,
        canActivate: [CanActivateLoggedInGuard, CanActivateVisitGuard],
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PublicDocumentsComponentRoutingModule { }
