import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultsComponentRoutingModule } from './search-results.component-routing.module';
import { SearchResultsComponent } from './search-results.component';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchResultsComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule
  ],
  declarations: [SearchResultsComponent]
})
export class SearchResultsComponentModule { }
