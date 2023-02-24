import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsComponentRoutingModule } from './posts.component-routing.module';
import { PostsComponent } from './posts.component';
import { SinglePostComponent } from './single-post/single-post.component';

import { AppMaterialModule } from '../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { AppSharedModule } from '../app-shared.module';
import { SinglePostDialogComponent } from './components/single-post-dialog/single-post-dialog.component';
import { PostsFloatingMenuComponent } from './components/posts-floating-menu/posts-floating-menu.component';
import { PostsSheetMenuComponent } from './components/posts-sheet-menu/posts-sheet-menu.component';
import { SearchPostsDialogComponent } from './components/search-posts-dialog/search-posts-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PostsComponentRoutingModule,
    AppMaterialModule,
    ComponentsModule,
    AppSharedModule
  ],
  declarations: [
    PostsComponent,
    SinglePostComponent,
    SinglePostDialogComponent,
    PostsFloatingMenuComponent,
    PostsSheetMenuComponent,
    SearchPostsDialogComponent
  ],
  exports: [
    SinglePostDialogComponent,
    PostsFloatingMenuComponent,
    PostsSheetMenuComponent,
    SearchPostsDialogComponent
  ],
  entryComponents: [
    SinglePostDialogComponent,
    PostsSheetMenuComponent,
    SearchPostsDialogComponent
  ]
})
export class PostsComponentModule { }
