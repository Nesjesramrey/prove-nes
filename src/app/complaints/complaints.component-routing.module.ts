import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAdminGuard } from '../guards/admin.guard';
import { ComplaintsComponent } from './complaints.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: ComplaintsComponent, canActivate: [CanActivateAdminGuard] }] }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class ComplaintsComponentRoutingModule { }
