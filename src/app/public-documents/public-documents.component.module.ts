import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicDocumentsComponent } from './public-documents.component';
import { PublicDocumentsComponentRoutingModule } from './public-documents..component-routing.module';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CardDocumentComponent } from './components/card-document/card-document.component';
import { HeaderComponent } from './components/header/header.component';
import { ComponentsModule } from '../components/components.module';
import { AppMaterialModule } from '../app-material.module';
import { PublicComponent } from './public/public.component';
import { SelectedCategoryComponent } from './selected-category/selected-category.component';
import { CategoryComponent } from './category/category.component';
import { TopicComponent } from './topic/topic.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { SolutionComponent } from './solution/solution.component';
import { ComponentsModule as PublicComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    PublicDocumentsComponent,
    TestimonialsComponent,
    CardDocumentComponent,
    HeaderComponent,
    PublicComponent,
    SelectedCategoryComponent,
    CategoryComponent,
    TopicComponent,
    SubcategoryComponent,
    SolutionComponent,
  ],
  imports: [
    CommonModule,
    PublicDocumentsComponentRoutingModule,
    ComponentsModule,
    AppMaterialModule,
    PublicComponentsModule,
  ],
})
export class PublicDocumentsModule {}
