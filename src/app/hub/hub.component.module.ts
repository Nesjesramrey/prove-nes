import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HubComponentRoutingModule } from './hub.component-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { HubComponentsModule } from './components/hub.components.module';
import { AppSharedModule } from '../app-shared.module';

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
import { NgChartsModule } from 'ng2-charts';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';

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
    NgChartsModule
  ],
  declarations: [
    HubComponent,
    SignUpComponent,
    SignInComponent,
    SingleUserComponent,
    UserNotificationsComponent,
    AppConfigurationComponent,
    PasswordRecoveryComponent,
  ],
})
export class HubComponentModule {}
