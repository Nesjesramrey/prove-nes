import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/app-material.module';
import { IvyCarouselModule } from 'angular-responsive-carousel';

import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { EditorTemplateComponent } from './editor-template/editor-template.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    IvyCarouselModule,
    NgChartsModule
  ],
  declarations: [
    AdminTemplateComponent,
    EditorTemplateComponent,
    MapBoxComponent,
  ],
  exports: [AdminTemplateComponent, EditorTemplateComponent, MapBoxComponent],
  entryComponents: [],
  providers: [],
})
export class HubComponentsModule {}
