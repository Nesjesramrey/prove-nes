import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';
import { CollegeMarathonComponentRoutingModule } from './college-marathon.component-routing.module';
import { LyDialogModule } from '@alyle/ui/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { CollegeMarathonComponent } from './college-marathon.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddSolutionDialogComponent } from './add-solution-dialog/add-solution-dialog.component';
import { TeamListComponent } from './team-list/team-list.component';
import { SingleTeamComponent } from './single-team/single-team.component';
import { SelectCollegeDialogComponent } from './select-college-dialog/select-college-dialog.component';
import { MarathonInfoDialogComponent } from './marathon-info-dialog/marathon-info-dialog.component';
import { AddTeamCollaboratorComponent } from './add-team-collaborator/add-team-collaborator.component';
import { TeamVoteDialogComponent } from './team-vote-dialog/team-vote-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollegeMarathonComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule,
    AngularEditorModule,
    LyDialogModule,
    PdfViewerModule
  ],
  declarations: [
    CollegeMarathonComponent,
    CreateTeamComponent,
    AddTopicDialogComponent,
    AddSolutionDialogComponent,
    TeamListComponent,
    SingleTeamComponent,
    SelectCollegeDialogComponent,
    MarathonInfoDialogComponent,
    AddTeamCollaboratorComponent,
    TeamVoteDialogComponent
  ],
  exports: [
    AddTopicDialogComponent,
    AddSolutionDialogComponent,
    TeamListComponent,
    SingleTeamComponent,
    SelectCollegeDialogComponent,
    MarathonInfoDialogComponent,
    AddTeamCollaboratorComponent,
    TeamVoteDialogComponent
  ],
  entryComponents: [
    AddTopicDialogComponent,
    AddSolutionDialogComponent,
    SelectCollegeDialogComponent,
    MarathonInfoDialogComponent,
    AddTeamCollaboratorComponent,
    TeamVoteDialogComponent
  ]
})
export class CollegeMarathonComponentModule { }
