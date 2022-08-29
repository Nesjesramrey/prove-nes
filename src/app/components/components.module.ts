import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../app-material.module';
import { NgChartsModule } from 'ng2-charts';
import { AppSharedModule } from '../app-shared.module';

import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyIconModule } from '@alyle/ui/icon';

import { AppPageletComponent } from './app-pagelet/app-pagelet.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { EmailValidationDialogComponent } from './email-validation-dialog/email-validation-dialog.component';
import { AddDocumentDialogComponent } from './add-document-dialog/add-document-dialog.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { SpiderChartComponent } from './spider-chart/spider-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { SetAvatarDialogComponent } from './set-avatar-dialog/set-avatar-dialog.component';
import { AddPermissionsComponent } from './add-permissions/add-permissions.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { AddDocumentLayoutComponent } from './add-document-layout/add-document-layout.component';
import { AddDocumentCategoryComponent } from './add-document-category/add-document-category.component';
import { AddDocumentCollaboratorComponent } from './add-document-collaborator/add-document-collaborator.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { AvatarsRowComponent } from './avatars-row/avatars-row.component';
import { HorizontalStatsComponent } from './horizontal-stats/horizontal-stats.component';
import { VerticalStatsComponent } from './vertical-stats/vertical-stats.component';
import { Top10ListComponent } from './top10-list/top10-list.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { FeaturedUsersComponent } from './featured-users/featured-users.component';
import { ModalPermissionComponent } from './modal-permission/modal-permission.component';
import { PanelSubcategoryComponent } from './panel-subcategory/panel-subcategory.component';
import { CircumferenceCustonComponent } from './circumference-custon/circumference-custon.component';

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
    AppSharedModule,
  ],
  declarations: [
    AppPageletComponent,
    AppFooterComponent,
    EmailValidationDialogComponent,
    AddDocumentDialogComponent,
    PieChartComponent,
    SpiderChartComponent,
    LineChartComponent,
    SetAvatarDialogComponent,
    AddPermissionsComponent,
    MessageBoxComponent,
    AddDocumentLayoutComponent,
    AddDocumentCategoryComponent,
    AddDocumentCollaboratorComponent,
    HorizontalStatsComponent,
    BreadcrumbsComponent,
    AvatarsRowComponent,
    VerticalStatsComponent,
    Top10ListComponent,
    FeaturedUsersComponent,
    PanelSubcategoryComponent,
    MapBoxComponent,
    ModalPermissionComponent,
    CircumferenceCustonComponent,
  ],
  exports: [
    AppPageletComponent,
    AppFooterComponent,
    EmailValidationDialogComponent,
    AddDocumentDialogComponent,
    PieChartComponent,
    SpiderChartComponent,
    LineChartComponent,
    SetAvatarDialogComponent,
    AddPermissionsComponent,
    MessageBoxComponent,
    AddDocumentLayoutComponent,
    AddDocumentCategoryComponent,
    AddDocumentCollaboratorComponent,
    HorizontalStatsComponent,
    VerticalStatsComponent,
    BreadcrumbsComponent,
    AvatarsRowComponent,
    VerticalStatsComponent,
    Top10ListComponent,
    PanelSubcategoryComponent,
    FeaturedUsersComponent,
    MapBoxComponent,
    ModalPermissionComponent,
    CircumferenceCustonComponent,
  ],
  entryComponents: [
    EmailValidationDialogComponent,
    AddDocumentDialogComponent,
    SetAvatarDialogComponent,
    AddPermissionsComponent,
    AddDocumentLayoutComponent,
    AddDocumentCategoryComponent,
    AddDocumentCollaboratorComponent,
  ],
  providers: [],
})
export class ComponentsModule { }
