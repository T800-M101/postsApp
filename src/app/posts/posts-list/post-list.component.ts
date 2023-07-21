import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(private postsService: PostsService){}
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  
  posts!:Post[];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  noPost = true;
  counter = 0;
  morePosts=true;
 

  private postSubs: Subscription = new Subscription;
 
  
  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postSubs = this.postsService.getPostsUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }
  
  onChangePage(pageData: PageEvent) {
    this.morePosts = this.paginator.hasNextPage();
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
  }

  onDelete(id: string): void {
    this.isLoading = true;
    this.postsService.deletePost(id)
    .subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

}
