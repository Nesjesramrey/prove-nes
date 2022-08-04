import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from "../app-material.module";
import { NgChartsModule } from "ng2-charts";
import { AppSharedModule } from "../app-shared.module";

import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyIconModule } from '@alyle/ui/icon';

import { AppPageletComponent } from "./app-pagelet/app-pagelet.component";
import { AppFooterComponent } from "./app-footer/app-footer.component";
import { EmailValidationDialogComponent } from "./email-validation-dialog/email-validation-dialog.component";
import { AddDocumentDialogComponent } from "./add-document-dialog/add-document-dialog.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { SetAvatarDialogComponent } from "./set-avatar-dialog/set-avatar-dialog.component";
import { AddPermissionsComponent } from "./add-permissions/add-permissions.component";
import { MessageBoxComponent } from "./message-box/message-box.component";
import { AddDocumentLayoutComponent } from "./add-document-layout/add-document-layout.component";
import { DocumentManagerComponent } from "./document-manager/document-manager.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    LyToolbarModule,
    LyTypographyModule,
    LyButtonModule,
    LyFieldModule,
    LySelectModule,
    LyTooltipModule,
    LyImageCropperModule,
    LySliderModule,
    LyIconModule,
    NgChartsModule,
    AppSharedModule
  ],
  declarations: [
    AppPageletComponent,
    AppFooterComponent,
    EmailValidationDialogComponent,
    AddDocumentDialogComponent,
    PieChartComponent,
    LineChartComponent,
    SetAvatarDialogComponent,
    AddPermissionsComponent,
    MessageBoxComponent,
    AddDocumentLayoutComponent,
    DocumentManagerComponent
  ],
  exports: [
    AppPageletComponent,
    AppFooterComponent,
    EmailValidationDialogComponent,
    AddDocumentDialogComponent,
    PieChartComponent,
    LineChartComponent,
    SetAvatarDialogComponent,
    AddPermissionsComponent,
    MessageBoxComponent,
    AddDocumentLayoutComponent,
    DocumentManagerComponent
  ],
  entryComponents: [
    EmailValidationDialogComponent,
    AddDocumentDialogComponent,
    SetAvatarDialogComponent,
    AddPermissionsComponent,
    AddDocumentLayoutComponent,
    DocumentManagerComponent
  ],
  providers: [],
})
export class ComponentsModule { }
