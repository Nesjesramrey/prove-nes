import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAdminGuard } from '../guards/admin.guard';
import { CanActivateLoggedInGuard } from '../guards/logged-in.guard';
import { SingleTestimonialComponent } from './single-testimonial/single-testimonial.component';
import { TestimonialsComponent } from './testimonials.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: TestimonialsComponent, canActivate: [CanActivateLoggedInGuard, CanActivateAdminGuard] }] },
  { path: ':testimonyID', component: SingleTestimonialComponent, canActivate: [CanActivateLoggedInGuard, CanActivateAdminGuard] },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class TestimonialsComponentRoutingModule { }
