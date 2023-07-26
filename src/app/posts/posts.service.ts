import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + 'posts';

@Injectable({providedIn: 'root'})
export class PostsService {
    
    constructor(private http: HttpClient,private router: Router){}

    private posts: Post[] = [];
    private postUpdated = new Subject<{posts: Post[], postCount: number}>();

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{ message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
        .pipe( map( ( postData ) => {
             return {
                posts:postData.posts.map( ( post: any ) => {
                return {
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    imagePath: post.imagePath,
                    creator: post.creator
                };
             }), maxPosts: postData.maxPosts
            };
       }))
        .subscribe( transforedPostData=> {
           this.posts = transforedPostData.posts;
           this.postUpdated.next({posts: [...this.posts], postCount: transforedPostData.maxPosts});
        });
    }


    getPostsUpdateListener() {
        return this.postUpdated.asObservable();
    }

    getPost(id: string): any {
        return this.http.get<{ 
            id: string, 
            title: string, 
            content: string, 
            imagePath:string, 
            creator: string 
        }>(BACKEND_URL + "/" + id);
    }
    
    addPost(title: string, content: string, image: File): void {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
        .subscribe( (responseData) => {
            this.router.navigate(['/']);
        });
    }

    updatePost(id: string, title: string, content: string, image: File | string): void {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = { 
                id: id, 
                title: title, 
                content: content, 
                imagePath: image,
                creator: undefined
            };
        }
        this.http
        .put(BACKEND_URL + "/" + id, postData)
        .subscribe({
            next: response => this.router.navigate(['/']),
    
        });
            
    }

    deletePost(id: string) {
       return this.http.delete(BACKEND_URL + "/" + id);
    }
}


