import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/app-material.module';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { EditorTemplateComponent } from './editor-template/editor-template.component';
import { CTypeTemplateComponent } from './c-type-template/c-type-template.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { NgChartsModule } from 'ng2-charts';
import { AdminTemplateMobileComponent } from './admin-template-mobile/admin-template-mobile.component';
import { CardTopicsDesktopComponent } from './card-topics-desktop/card-topics-desktop.component';

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
    AdminTemplateMobileComponent,
    EditorTemplateComponent,
    CTypeTemplateComponent,
    MapBoxComponent,
    CardTopicsDesktopComponent
  ],
  exports: [
    AdminTemplateComponent,
    AdminTemplateMobileComponent,
    EditorTemplateComponent,
    CTypeTemplateComponent,
    MapBoxComponent,
    CardTopicsDesktopComponent
  ],
  entryComponents: [],
  providers: [],
})
export class HubComponentsModule { }
