import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService {
    
    constructor(private http: HttpClient,private router: Router ){}

    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();

    getPosts() {
       this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
       .pipe( map( ( postData ) => {
             return postData.posts.map( ( post: any ) => {
                return {
                    id: post._id,
                    title: post.title,
                    content: post.content
                }
             });
       }))
       .subscribe(posts => {
           this.posts = posts;
           this.postUpdated.next([...this.posts]);
       });
    }

    getPostsUpdateListener() {
        return this.postUpdated.asObservable();
    }

    getPost(id: string): any {
        return this.http.get<{ id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
    }
    
    addPost(title: string, content: string): void {
        const post: Post = { id: '', title: title, content: content };
        this.http.post<{message: string, id: string}>('http://localhost:3000/api/posts', post)
        .subscribe( (responseData) => {
            post.id = responseData.id;
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    updatePost(id: string, title: string, content: string): void {
        const post: Post = { id: id, title: title, content: content};
        this.http.put('http://localhost:3000/api/posts/' + id, post)
        .subscribe( response => {
           const updatedPosts = [...this.posts];
           const oldPostIndex = updatedPosts.findIndex( p => p.id === post.id );
           updatedPosts[oldPostIndex] = post;
           this.posts = updatedPosts;
           this.postUpdated.next([...this.posts]);
           this.router.navigate(['/']);
        });
    }

    deletePost(id: string) {
       this.http.delete('http://localhost:3000/api/posts/' + id)
       .subscribe( ( message: any ) => {
         console.log(message.message);
         this.posts = this.posts.filter( post => post.id !== id);
         this.postUpdated.next([...this.posts]);
       });
    }
}