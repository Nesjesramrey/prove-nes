import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../app-material.module';
import { NgChartsModule } from 'ng2-charts';
import { AppSharedModule } from '../app-shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

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
import { LineChartComponent } from './line-chart/line-chart.component';
import { SetAvatarDialogComponent } from './set-avatar-dialog/set-avatar-dialog.component';
import { AddPermissionsComponent } from './add-permissions/add-permissions.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { AddDocumentLayoutComponent } from './add-document-layout/add-document-layout.component';
import { AddDocumentCategoryComponent } from './add-document-category/add-document-category.component';
import { AddDocumentCollaboratorComponent } from './add-document-collaborator/add-document-collaborator.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { AvatarsRowComponent } from './avatars-row/avatars-row.component';
import { AddDocumentThemeComponent } from './add-document-theme/add-document-theme.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { AddDocumentSolutionComponent } from './add-document-solution/add-document-solution.component';
import { AddDocumentTestimonyComponent } from './add-document-testimony/add-document-testimony.component';
import { CarouselComponent } from './carousel/carousel.component';
import { EditDocumentDataComponent } from './edit-document-data/edit-document-data.component';
import { EditCategoryDataComponent } from './edit-category-data/edit-category-data.component';
import { SliderImagesComponent } from './slider-images/slider-images.component';
import { AddDocumentCoverTextComponent } from "./add-document-cover-text/add-document-cover-text.component";
import { WindowAlertComponent } from "./window-alert/window-alert.component";
import { AddRootCategoryComponent } from "./add-root-category/add-root-category.component";
import { ImageViewerComponent } from "./image-viewer/image-viewer.component";
import { MapBoxComponent } from './map-box/map-box.component';
import { CircleChartComponent } from './circle-chart/circle-chart.component';
import { SpiderChartComponent } from './spider-chart/spider-chart.component';
import { DocumentUserListComponent } from './document-user-list/document-user-list.component';
import { AddCommentsComponent } from './add-comments/add-comments.component';
import { AddDocumentCommentComponent } from './add-document-comment/add-document-comment.component';
import { DialogErrorComponent } from './dialog-error/dialog-error.component';
import { DescriptionViewerComponent } from './description-viewer/description-viewer.component';
import { ViewMessageComponent } from './view-message/view-message.component';
import { ViewDocumentCommentsComponent } from './view-document-comments/view-document-comments.component';
import { ReplyDocumentCommentsComponent } from './reply-document-comments/reply-document-comments.component';
import { EditTopicDataComponent } from './edit-topic-data/edit-topic-data.component';
import { EditSolutionDataComponent } from './edit-solution-data/edit-solution-data.component';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { RequestEditPermissionComponent } from './request-edit-permission/request-edit-permission.component';
import { GiveEditPermissionComponent } from './give-edit-permission/give-edit-permission.component';
import { PublicDocumentMobileViewComponent } from './public-document-mobile-view/public-document-mobile-view.component';
import { PublicDocumentMobileCategoryBarsComponent } from './public-document-mobile-category-bars/public-document-mobile-category-bars.component';
import { PublicDocumentMobileRadarChartComponent } from './public-document-mobile-radar-chart/public-document-mobile-radar-chart.component';
import { PublicDocumentMobileTopTenComponent } from './public-document-mobile-top-ten/public-document-mobile-top-ten.component';
import { PublicDocumentMobileCategoryViewComponent } from './public-document-mobile-category-view/public-document-mobile-category-view.component';
import { PublicDocumentMobileFixedToolsComponent } from './public-document-mobile-fixed-tools/public-document-mobile-fixed-tools.component';

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
    AngularEditorModule
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
    AddDocumentCategoryComponent,
    AddDocumentCollaboratorComponent,
    BreadcrumbsComponent,
    AvatarsRowComponent,
    AddDocumentThemeComponent,
    CompleteRegistrationComponent,
    AddDocumentSolutionComponent,
    AddDocumentTestimonyComponent,
    CarouselComponent,
    EditDocumentDataComponent,
    EditCategoryDataComponent,
    SliderImagesComponent,
    AddDocumentCoverTextComponent,
    WindowAlertComponent,
    AddRootCategoryComponent,
    ImageViewerComponent,
    MapBoxComponent,
    CircleChartComponent,
    SpiderChartComponent,
    DocumentUserListComponent,
    AddDocumentCommentComponent,
    AddCommentsComponent,
    DialogErrorComponent,
    DescriptionViewerComponent,
    ViewMessageComponent,
    ViewDocumentCommentsComponent,
    ReplyDocumentCommentsComponent,
    EditTopicDataComponent,
    EditSolutionDataComponent,
    WelcomeDialogComponent,
    AddCategoryDialogComponent,
    RequestEditPermissionComponent,
    GiveEditPermissionComponent,
    PublicDocumentMobileViewComponent,
    PublicDocumentMobileCategoryBarsComponent,
    PublicDocumentMobileRadarChartComponent,
    PublicDocumentMobileTopTenComponent,
    PublicDocumentMobileCategoryViewComponent,
    PublicDocumentMobileFixedToolsComponent
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
    AddDocumentCategoryComponent,
    AddDocumentCollaboratorComponent,
    BreadcrumbsComponent,
    AvatarsRowComponent,
    CompleteRegistrationComponent,
    CarouselComponent,
    EditDocumentDataComponent,
    EditCategoryDataComponent,
    SliderImagesComponent,
    AddDocumentCoverTextComponent,
    WindowAlertComponent,
    AddRootCategoryComponent,
    ImageViewerComponent,
    MapBoxComponent,
    SpiderChartComponent,
    CircleChartComponent,
    AddDocumentSolutionComponent,
    DocumentUserListComponent,
    AddDocumentCommentComponent,
    AddCommentsComponent,
    DescriptionViewerComponent,
    ViewMessageComponent,
    ViewDocumentCommentsComponent,
    ReplyDocumentCommentsComponent,
    EditTopicDataComponent,
    EditSolutionDataComponent,
    WelcomeDialogComponent,
    AddCategoryDialogComponent,
    RequestEditPermissionComponent,
    GiveEditPermissionComponent,
    PublicDocumentMobileViewComponent,
    PublicDocumentMobileCategoryBarsComponent,
    PublicDocumentMobileRadarChartComponent,
    PublicDocumentMobileTopTenComponent,
    PublicDocumentMobileCategoryViewComponent,
    PublicDocumentMobileFixedToolsComponent
  ],
  entryComponents: [
    EmailValidationDialogComponent,
    AddDocumentDialogComponent,
    SetAvatarDialogComponent,
    AddPermissionsComponent,
    AddDocumentLayoutComponent,
    AddDocumentCategoryComponent,
    AddDocumentCollaboratorComponent,
    CompleteRegistrationComponent,
    EditDocumentDataComponent,
    EditCategoryDataComponent,
    AddDocumentCoverTextComponent,
    WindowAlertComponent,
    AddRootCategoryComponent,
    ImageViewerComponent,
    DocumentUserListComponent,
    AddCommentsComponent,
    DescriptionViewerComponent,
    ViewMessageComponent,
    ViewDocumentCommentsComponent,
    ReplyDocumentCommentsComponent,
    EditTopicDataComponent,
    EditSolutionDataComponent,
    WelcomeDialogComponent,
    AddCategoryDialogComponent,
    RequestEditPermissionComponent,
    GiveEditPermissionComponent
  ],
  providers: [],
})
export class ComponentsModule { }
