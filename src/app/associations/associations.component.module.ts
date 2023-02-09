import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssociationsComponentRoutingModule } from './associations.component-routing.module';
import { AssociationsComponent } from './associations.component';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';
import { SingleAssociationComponent } from './single-association/single-association.component';
import { LyDialogModule } from '@alyle/ui/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AssociationsComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule,
    LyDialogModule,

  ],
  declarations: [
    AssociationsComponent,
    SingleAssociationComponent
  ]
})
export class AssociationsComponentModule { }
