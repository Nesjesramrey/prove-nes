import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LegalComponentRoutingModule } from './legal.component-routing.module';
import { LegalComponent } from './legal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LegalComponentRoutingModule
  ],
  declarations: [LegalComponent]
})
export class LegalComponentModule { }
