import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SolutionComponent } from './solution/solution.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      {
        path: ':documentID',
        component: MainComponent,
        canActivate: [],
      },
      {
        path: ':documentID/solucion/:solutionID',
        component: SolutionComponent,
        canActivate: [],
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PublicDocumentsComponentRoutingModule {}
