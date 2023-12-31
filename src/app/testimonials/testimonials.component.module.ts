import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestimonialsComponentRoutingModule } from './testimonials.component-routing.module';
import { TestimonialsComponent } from './testimonials.component';

import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';
import { SingleTestimonialComponent } from './single-testimonial/single-testimonial.component';
import { PublicTestimonialsComponent } from './public-testimonials/public-testimonials.component';
// import { SingleComplaintComponent } from './single-complaint/single-complaint.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestimonialsComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule,
  ],
  declarations: [
    TestimonialsComponent,
    SingleTestimonialComponent,
    PublicTestimonialsComponent,
  ],
})
export class TestimonialsComponentModule {}
