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
import { SingleThemeComponent } from './single-theme/single-theme.component';
import { SingleSubcategoryComponent } from './single-subcategory/single-subcategory.component';
import { SingleSolutionComponent } from './single-solution/single-solution.component';
import { NgChartsModule } from 'ng2-charts';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsComponentRoutingModule,
    AppMaterialModule,
    AppSharedModule,
    ComponentsModule,
    NgChartsModule,
    AngularEditorModule
  ],
  declarations: [
    DocumentsComponent,
    SingleDocumentComponent,
    SingleCategoryComponent,
    SingleSubcategoryComponent,
    SingleThemeComponent,
    SingleSolutionComponent
  ],
})
export class DocumentsComponentModule { }
