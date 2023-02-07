import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAdminGuard } from '../guards/admin.guard';
import { SingleTestimonialComponent } from './single-testimonial/single-testimonial.component';
import { TestimonialsComponent } from './testimonials.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: TestimonialsComponent, canActivate: [CanActivateAdminGuard] }] },
  { path: ':testimonyID', component: SingleTestimonialComponent, canActivate: [] },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class TestimonialsComponentRoutingModule { }
