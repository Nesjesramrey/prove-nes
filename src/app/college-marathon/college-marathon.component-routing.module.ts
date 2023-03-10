import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeMarathonComponent } from './college-marathon.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { SingleTeamComponent } from './single-team/single-team.component';
import { TeamListComponent } from './team-list/team-list.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: CollegeMarathonComponent },
      { path: 'registro', component: CreateTeamComponent },
      { path: 'equipos', component: TeamListComponent },
      { path: ':teamID', component: SingleTeamComponent },
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CollegeMarathonComponentRoutingModule { }
