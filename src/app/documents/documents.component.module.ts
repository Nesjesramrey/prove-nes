import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsComponentRoutingModule } from './documents.component-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { AppSharedModule } from '../app-shared.module';

import { DocumentsComponent } from './documents.component';
import { SingleDocumentComponent } from './single-document/single-document.component';
import { ComponentsModule } from '../components/components.module';
import { SingleCategoryComponent } from './single-category/single-category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsComponentRoutingModule,
    AppMaterialModule,
    AppSharedModule,
    ComponentsModule
  ],
  declarations: [
    DocumentsComponent,
    SingleDocumentComponent,
    SingleCategoryComponent
  ]
})
export class DocumentsComponentModule { }
