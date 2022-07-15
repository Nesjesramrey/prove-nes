import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material.module';
import { FirstWordPipe } from './pipes/firstword.pipe';
import { FirstLetterPipe } from './pipes/firstletter.pipe';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FirstWordPipe,
    FirstLetterPipe
  ],
  exports: [
    FirstWordPipe,
    FirstLetterPipe
  ],
  entryComponents: []
})
export class AppSharedModule { }
