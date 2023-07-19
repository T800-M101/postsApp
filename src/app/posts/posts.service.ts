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
                    content: post.content,
                    imagePath: post.imagePath
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
        return this.http.get<{ id: string, title: string, content: string, imagePath:string }>('http://localhost:3000/api/posts/' + id);
    }
    
    addPost(title: string, content: string, image: File): void {
        //const post: Post = { id: '', title: title, content: content };
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
        .subscribe( (responseData) => {
            const post: Post = {
                id: responseData.post.id, 
                title: title, 
                content: content,
                imagePath: responseData.post.imagePath
            };
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
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
                imagePath: image 
            };
        }
        this.http
        .put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe( response => {
           const updatedPosts = [...this.posts];
           const oldPostIndex = updatedPosts.findIndex( p => p.id === id );
           const post: Post = { 
            id: id, 
            title: title, 
            content: content, 
            imagePath: ''
        };
    
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