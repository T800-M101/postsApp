import { NgModule } from "@angular/core";
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './posts-list/post-list.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule{}