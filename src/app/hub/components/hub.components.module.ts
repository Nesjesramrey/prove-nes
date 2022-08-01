import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from "src/app/app-material.module";
import { IvyCarouselModule } from 'angular-responsive-carousel';

import { AdminTemplateComponent } from "./admin-template/admin-template.component";
import { EditorTemplateComponent } from "./editor-template/editor-template.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    IvyCarouselModule
  ],
  declarations: [
    AdminTemplateComponent,
    EditorTemplateComponent
  ],
  exports: [
    AdminTemplateComponent,
    EditorTemplateComponent
  ],
  entryComponents: [],
  providers: [],
})
export class HubComponentsModule { }
