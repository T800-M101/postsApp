import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class PostsService {
    constructor(private http: HttpClient){}
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
    
    addPost(title: string, content: string): void {
        const post: Post = { id: '', title: title, content: content };
        this.http.post<{message: string, id: string}>('http://localhost:3000/api/posts', post)
        .subscribe( (responseData) => {
            post.id = responseData.id;
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
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