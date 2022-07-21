import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HubComponentRoutingModule } from './hub.component-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HubComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule,
    LyCarouselModule,
    LyTypographyModule,
    LyFieldModule,
    LyButtonModule,
    LyCheckboxModule,
    LyDialogModule,
    IvyCarouselModule
  ],
  declarations: [
    HubComponent,
    SignUpComponent,
    SignInComponent,
    SingleUserComponent,
    UserNotificationsComponent
  ]
})
export class HubComponentModule { }