import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './posts.component';
import { SinglePostComponent } from './single-post/single-post.component';

const routes: Routes = [
  { path: '', children: [{ path: '', component: PostsComponent, canActivate: [] }] },
  { path: ':postID', component: SinglePostComponent, canActivate: [] },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class PostsComponentRoutingModule { }
