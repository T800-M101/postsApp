import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(private postsService: PostsService){}
  
  posts:Post[] | undefined;
  private postSubs: Subscription = new Subscription;
  
  ngOnInit(): void {
    this.postsService.getPosts();
    this.postSubs = this.postsService.getPostsUpdateListener()
    .subscribe((posts: Post[]) => this.posts = posts);
  }
  
  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
  }

  onDelete(id: string): void {
    this.postsService.deletePost(id);
  }
}
