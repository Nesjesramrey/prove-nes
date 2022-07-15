import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponentRoutingModule } from './not-found.component-routing.module';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotFoundComponentRoutingModule
  ],
  declarations: [NotFoundComponent]
})
export class NotFoundComponentModule { }
