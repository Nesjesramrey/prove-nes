import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';
import { CollegeMarathonComponentRoutingModule } from './college-marathon.component-routing.module';
import { CollegeMarathonComponent } from './college-marathon.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddSolutionDialogComponent } from './add-solution-dialog/add-solution-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollegeMarathonComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule,
    AngularEditorModule
  ],
  declarations: [
    CollegeMarathonComponent,
    CreateTeamComponent,
    AddTopicDialogComponent,
    AddSolutionDialogComponent
  ],
  exports: [
    AddTopicDialogComponent,
    AddSolutionDialogComponent
  ],
  entryComponents: [
    AddTopicDialogComponent,
    AddSolutionDialogComponent
  ]
})
export class CollegeMarathonComponentModule { }
