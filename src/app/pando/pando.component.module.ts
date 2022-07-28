import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PandoComponentRoutingModule } from './pando.component-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';

import { LyDialogModule } from '@alyle/ui/dialog';
import { LySelectModule } from '@alyle/ui/select';
import { LyFieldModule } from '@alyle/ui/field';

import { PandoComponent } from './pando.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SupportConversationsComponent } from './support-conversations/support-conversations.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PandoComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule,
    LyDialogModule,
    LySelectModule,
    LyFieldModule
  ],
  declarations: [
    PandoComponent,
    UsersListComponent,
    SupportConversationsComponent
  ]
})
export class PandoComponentModule { }
