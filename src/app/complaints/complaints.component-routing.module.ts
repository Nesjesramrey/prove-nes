import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAdminGuard } from '../guards/admin.guard';
import { CanActivateLoggedInGuard } from '../guards/logged-in.guard';
import { ComplaintsComponent } from './complaints.component';
import { SingleComplaintComponent } from './single-complaint/single-complaint.component';


const routes: Routes = [
  { path: '', children: [{ path: '', component: ComplaintsComponent, canActivate: [CanActivateLoggedInGuard, CanActivateAdminGuard] }] },
  { path: ':complaintID', component: SingleComplaintComponent, canActivate: [CanActivateLoggedInGuard, CanActivateAdminGuard] },


];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class ComplaintsComponentRoutingModule { }
