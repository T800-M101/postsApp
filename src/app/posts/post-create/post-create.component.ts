import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    private mode = 'create';
    private id!: string;
    post = {id: '', title: '', content: ''};
    isLoading = false;

    constructor(private postsService: PostsService, public route: ActivatedRoute){}
    
    ngOnInit(): void {
        this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
             if (paramMap.has('id')) {
                this.mode = 'edit';
                this.id = paramMap.get('id')!;
                this.isLoading = true;
                this.postsService.getPost(this.id)
                .subscribe( ( postData: any) => {
                    this.isLoading = false;
                    this.post = { id: postData.id, title: postData.title, content: postData.content };
                });
             }
        });
    }

    onSavePost(form: NgForm): void {
        if (form.invalid) return;
        
        this.isLoading = true;
        if (this.mode === 'create' ) {
            console.log(this.mode)
            this.postsService.addPost(form.value.title, form.value.content);
        } else {
            this.postsService.updatePost(this.id, form.value.title, form.value.content);
        }



        form.resetForm();
        
    }
}