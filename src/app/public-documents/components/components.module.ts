import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../../app-material.module';
import { NgChartsModule } from 'ng2-charts';
import { AppSharedModule } from '../../app-shared.module';

import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTooltipModule } from '@alyle/ui/tooltip';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyIconModule } from '@alyle/ui/icon';
import { Top10ListComponent } from './top10-list/top10-list.component';
import { PanelSubcategoryComponent } from 'src/app/public-documents/components/panel-subcategory/panel-subcategory.component';
import { ModalPermissionComponent } from './modal-permission/modal-permission.component';
import { CircleCustomComponent } from './circle-custom/circle-custom.component';
import { ExpandedTextComponent } from './expanded-text/expanded-text.component';
import { FeaturedUsersComponent } from './featured-users/featured-users.component';
import { HorizontalStatsComponent } from './horizontal-stats/horizontal-stats.component';
import { PanelCirclesComponent } from './panel-circles/panel-circles.component';
import { SolutionsCardComponent } from './solutions-card/solutions-card.component';
import { TestimonyCardComponent } from './testimony-card/testimony-card.component';
import { VerticalStatsComponent } from './vertical-stats/vertical-stats.component';
import { ModalPermissionsComponent } from './modal-permissions/modal-permissions.component';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModalSolutionComponent } from './modal-solution/modal-solution.component';
import { ModalTestimonyComponent } from './modal-testimony/modal-testimony.component';
import { ModalVotesComponent } from './modal-votes/modal-votes.component';
import { ModalDesciptionComponent } from './modal-desciption/modal-desciption.component';

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
    MatDialogModule,
  ],
  declarations: [
    Top10ListComponent,
    PanelSubcategoryComponent,
    ModalPermissionComponent,
    CircleCustomComponent,
    ExpandedTextComponent,
    FeaturedUsersComponent,
    HorizontalStatsComponent,
    PanelCirclesComponent,
    PanelSubcategoryComponent,
    SolutionsCardComponent,
    TestimonyCardComponent,
    VerticalStatsComponent,
    ModalPermissionsComponent,
    ModalSolutionComponent,
    ModalTestimonyComponent,
    ModalVotesComponent,
    ModalDesciptionComponent,
  ],
  exports: [
    Top10ListComponent,
    PanelSubcategoryComponent,
    ModalPermissionComponent,
    CircleCustomComponent,
    ExpandedTextComponent,
    FeaturedUsersComponent,
    HorizontalStatsComponent,
    PanelCirclesComponent,
    PanelSubcategoryComponent,
    SolutionsCardComponent,
    TestimonyCardComponent,
    VerticalStatsComponent,
    ModalPermissionsComponent,
    ModalSolutionComponent,
    ModalTestimonyComponent,
  ],
  entryComponents: [],
  providers: [],
})
export class ComponentsModule {}
