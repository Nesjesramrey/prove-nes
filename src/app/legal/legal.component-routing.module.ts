import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalComponent } from './legal.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/404', pathMatch: 'full' },
      { path: '', component: LegalComponent },
      { path: 'aviso-privacidad', component: PrivacyComponent, canActivate: [] }
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class LegalComponentRoutingModule { }
