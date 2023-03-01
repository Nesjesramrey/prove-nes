import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';
import { CollegeMarathonComponentRoutingModule } from './college-marathon.component-routing.module';
import { CollegeMarathonComponent } from './college-marathon.component';
import { CreateTeamComponent } from './create-team/create-team.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollegeMarathonComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule
  ],
  declarations: [
    CollegeMarathonComponent,
    CreateTeamComponent
  ],
  exports: [],
  entryComponents: []
})
export class CollegeMarathonComponentModule { }
