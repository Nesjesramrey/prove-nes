import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './search-results.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: SearchResultsComponent }] }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class SearchResultsComponentRoutingModule { }
