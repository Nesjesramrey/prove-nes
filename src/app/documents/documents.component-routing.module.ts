import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { SingleDocumentComponent } from './single-document/single-document.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: DocumentsComponent },
      { path: ':documentID', component: SingleDocumentComponent, canActivate: [] }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class DocumentsComponentRoutingModule { }