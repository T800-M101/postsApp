import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/posts-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { isUserLoggedInGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [isUserLoggedInGuard] },
  { path: 'edit/:id', component: PostCreateComponent, canActivate: [isUserLoggedInGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
