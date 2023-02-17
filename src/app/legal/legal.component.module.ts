import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LegalComponentRoutingModule } from './legal.component-routing.module';
import { LegalComponent } from './legal.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { ComponentsModule } from '../components/components.module';
import { AppMaterialModule } from '../app-material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LegalComponentRoutingModule,
    ComponentsModule,
    AppMaterialModule
  ],
  declarations: [
    LegalComponent,
    PrivacyComponent,
    TermsComponent
  ]
})
export class LegalComponentModule { }
