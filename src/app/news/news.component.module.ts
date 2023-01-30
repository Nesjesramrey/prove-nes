import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsComponentRoutingModule } from './news.component-routing.module';
import { NewsComponent } from './news.component';

import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NewsComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule
  ],
  declarations: [
    NewsComponent
  ]
})
export class NewsComponentModule { }
