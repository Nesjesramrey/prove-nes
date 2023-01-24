import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateAdminGuard } from '../guards/admin.guard';
import { AssociationsComponent } from './associations.component';
import { SingleAssociationComponent } from './single-association/single-association.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: AssociationsComponent,  }] },
  { path:  ':associationID', component: SingleAssociationComponent, canActivate: [] },

];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AssociationsComponentRoutingModule { }