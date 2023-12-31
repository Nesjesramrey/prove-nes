import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComplaintsComponentRoutingModule } from './complaints.component-routing.module';
import { ComplaintsComponent } from './complaints.component';

import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';
import { SingleComplaintComponent } from './single-complaint/single-complaint.component';
import { PublicComplaintsComponent } from './public-complaints/public-complaints.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComplaintsComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule
  ],
  declarations: [
    ComplaintsComponent,
    SingleComplaintComponent,
    PublicComplaintsComponent,
  ],
  exports: [],
  entryComponents: []
})
export class ComplaintsComponentModule { }
