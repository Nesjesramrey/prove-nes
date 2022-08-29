import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicDocumentsComponent } from './public-documents.component';
import { MainComponent } from './main/main.component';
import { SolutionComponent } from './solution/solution.component';
import { PublicDocumentsComponentRoutingModule } from './public-documents..component-routing.module';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CardDocumentComponent } from './components/card-document/card-document.component';
import { HeaderComponent } from './components/header/header.component';
import { ComponentsModule } from '../components/components.module';
import { AppMaterialModule } from '../app-material.module';

@NgModule({
  declarations: [
    PublicDocumentsComponent,
    MainComponent,
    SolutionComponent,
    TestimonialsComponent,
    CardDocumentComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    PublicDocumentsComponentRoutingModule,
    ComponentsModule,
    AppMaterialModule,
  ],
})
export class PublicDocumentsModule {}
