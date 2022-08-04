import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentsComponentRoutingModule } from './documents.component-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { AppSharedModule } from '../app-shared.module';

import { DocumentsComponent } from './documents.component';
import { SingleDocumentComponent } from './single-document/single-document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsComponentRoutingModule,
    AppMaterialModule,
    AppSharedModule
  ],
  declarations: [
    DocumentsComponent,
    SingleDocumentComponent
  ]
})
export class DocumentsComponentModule { }
