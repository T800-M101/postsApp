import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    constructor(private postsService: PostsService){}

    // onAddPost(postInput: HTMLTextAreaElement): void {
    //     console.dir(postInput.value)
    //     this.newPost = postInput.value;
    // }

    onAddPost(form: NgForm): void {
        if (form.invalid) return;

        this.postsService.addPost(form.value.title, form.value.content);

        form.resetForm();
        
    }
}