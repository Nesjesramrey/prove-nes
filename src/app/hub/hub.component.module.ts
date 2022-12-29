import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HubComponentRoutingModule } from './hub.component-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { HubComponentsModule } from './components/hub.components.module';
import { AppSharedModule } from '../app-shared.module';
import { NgChartsModule } from 'ng2-charts';

import { LyCarouselModule } from '@alyle/ui/carousel';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyFieldModule } from '@alyle/ui/field';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyDialogModule } from '@alyle/ui/dialog';
import { IvyCarouselModule } from 'angular-responsive-carousel';

import { HubComponent } from './hub.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';
import { MapBoxComponent } from './components/map-box/map-box.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { SignInMobileComponent } from './sign-in-mobile/sign-in-mobile.component';
import { SignUpMobileComponent } from './sign-up-mobile/sign-up-mobile.component';
import { UserDocumentsComponent } from './user-documents/user-documents.component';
import { TabsMobileComponent } from './components/tabs-mobile/tabs-mobile.component';
import { SearchInputMobileComponent } from './components/search-input-mobile/search-input-mobile.component';
import { CardTopicsMobileComponent } from './components/card-topics-mobile/card-topics-mobile.component';
import { CommunityMobileComponent } from './components/community-mobile/community-mobile.component';
import { SpiderChartMobileComponent } from './components/spider-chart-mobile/spider-chart-mobile.component';
import { CircleChartMobileComponent } from './components/circle-chart-mobile/circle-chart-mobile.component';
import { LineChartMobileComponent } from './components/line-chart-mobile/line-chart-mobile.component';
import { ProfileMobileComponent } from './profile-mobile/profile-mobile.component';
import { FooterMobileComponent } from './components/footer-mobile/footer-mobile.component';
import { TopicSingleMobileComponent } from './components/topic-single-mobile/topic-single-mobile.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HubComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    HubComponentsModule,
    AppSharedModule,
    LyCarouselModule,
    LyTypographyModule,
    LyFieldModule,
    LyButtonModule,
    LyCheckboxModule,
    LyDialogModule,
    IvyCarouselModule,
    NgChartsModule,
  
  ],
  declarations: [
    HubComponent,
    SignUpComponent,
    SignInComponent,
    SingleUserComponent,
    UserNotificationsComponent,
    AppConfigurationComponent,
    PasswordRecoveryComponent,
    SignInMobileComponent,
    SignUpMobileComponent,
    UserDocumentsComponent,
    TabsMobileComponent,
    SearchInputMobileComponent,
    CardTopicsMobileComponent,
    CommunityMobileComponent,
    SpiderChartMobileComponent,
    CircleChartMobileComponent,
    LineChartMobileComponent, 
    ProfileMobileComponent, 
    FooterMobileComponent,
    TopicSingleMobileComponent
  ],
})
export class HubComponentModule {}
