import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponentRoutingModule } from './dashboard.component-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardComponentRoutingModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardComponentModule { }
