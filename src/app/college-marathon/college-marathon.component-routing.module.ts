import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeMarathonComponent } from './college-marathon.component';
import { CreateTeamComponent } from './create-team/create-team.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: CollegeMarathonComponent },
      { path: 'registro', component: CreateTeamComponent },
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CollegeMarathonComponentRoutingModule { }
