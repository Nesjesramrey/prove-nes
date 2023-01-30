import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: NewsComponent, canActivate: [] }] },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class NewsComponentRoutingModule { }
