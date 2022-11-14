import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerModule,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  LyHammerGestureConfig,
  LY_THEME,
  LY_THEME_NAME,
  StyleRenderer,
  LyTheme2,
} from '@alyle/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MinimaLight } from '@alyle/ui/themes/minima';
import { ComponentsModule } from './components/components.module';
import { AppSharedModule } from './app-shared.module';
import { AppMaterialModule } from './app-material.module';

import { AuthenticationService } from './services/authentication.service';
import { EndPointService } from './services/endpoint.service';
import { UtilityService } from './services/utility.service';
import { UserService } from './services/user.service';
import { DocumentService } from './services/document.service';
import { UploadService } from './services/upload.service';
import { SocketService } from './services/socket.service';
import { NotificationService } from './services/notification.service';
import { SupportService } from './services/support.service';
import { InterceptorService } from './services/interceptor.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { NgChartsModule } from 'ng2-charts';

// dev
// const firebaseConfig = {
//   apiKey: 'AIzaSyCPslMhtXbG3Yt5zbjrrFgEWQdkNI90eTs',
//   authDomain: 'pando-e0a16.firebaseapp.com',
//   projectId: 'pando-e0a16',
//   storageBucket: 'pando-e0a16.appspot.com',
//   messagingSenderId: '77420216693',
//   appId: '1:77420216693:web:af914a0056ca44b6b5133c',
//   measurementId: 'G-52TGZKKXKS',
// };

// prod
const firebaseConfig = {
  apiKey: "AIzaSyDAAsZGlnJEzPl9qPm0XiIP9YL4S--VPaU",
  authDomain: "mexicolectivo-d8868.firebaseapp.com",
  projectId: "mexicolectivo-d8868",
  storageBucket: "mexicolectivo-d8868.appspot.com",
  messagingSenderId: "762515665430",
  appId: "1:762515665430:web:5980490e2082d9e48d7b37",
  measurementId: "G-JCHQ7304T0"
};

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
const socketConfig: SocketIoConfig = { url: environment.apiSocket, options: {} };

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HammerModule,
    ComponentsModule,
    AppSharedModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    NgChartsModule,
    SocketIoModule.forRoot(socketConfig),
    AppMaterialModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig },
    StyleRenderer,
    LyTheme2,
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    AuthenticationService,
    EndPointService,
    UtilityService,
    UserService,
    DocumentService,
    UploadService,
    SocketService,
    NotificationService,
    SupportService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
