import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAdminGuard } from '../guards/admin.guard';
import { TestimonialsComponent } from './testimonials.component';
// import { SingleComplaintComponent } from './single-complaint/single-complaint.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: TestimonialsComponent, canActivate: [CanActivateAdminGuard] }] },
  // { path: ':complaintID', component: SingleComplaintComponent, canActivate: [] },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class TestimonialsComponentRoutingModule { }
