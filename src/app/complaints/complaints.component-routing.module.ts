import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAdminGuard } from '../guards/admin.guard';
import { ComplaintsComponent } from './complaints.component';
import { SingleComplaintComponent } from './single-complaint/single-complaint.component';
import { PublicComplaintsComponent } from './public-complaints/public-complaints.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: ComplaintsComponent, canActivate: [] }] },
  { path: 'denunciaspublicas', component: PublicComplaintsComponent, canActivate: [] },
  { path: ':complaintID', component: SingleComplaintComponent, canActivate: [] },
  

];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class ComplaintsComponentRoutingModule { }
