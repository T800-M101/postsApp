import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup,  Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { mimeType } from "./mime-type.validator";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy{
    post: Post = {
        id: '',
        title: '',
        content: '',
        imagePath: '',
        creator: ''
    };
    isLoading = false;
    form!: FormGroup;
    imagePreview!: any;

    private authStatusSub!: Subscription;
    private mode = 'create';
    private id!: string;

    constructor(private postsService: PostsService, public route: ActivatedRoute, private authService: AuthService){}

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
    
    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
            this.isLoading = false;
        });

        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl('', {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });

        this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
             if (paramMap.has('id')) {
                this.mode = 'edit';
                this.id = paramMap.get('id')!;
                this.isLoading = true;
                this.postsService.getPost(this.id)
                .subscribe( ( postData: any) => {
                    this.isLoading = false;
                    this.post = { 
                        id: postData.id, 
                        title: postData.title, 
                        content: postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator
                    };
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath ? this.post.imagePath : '' 
                    });
                });
             }
        });
    }

    onSavePost(): void {
        if (!this.form.status) return;
        
        this.isLoading = true;
        if (this.mode === 'create' ) {
            this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            this.postsService.updatePost(this.id, this.form.value.title, this.form.value.content, this.form.value.image);
        }

        this.form.reset();        
    }

    onImagePicked(event:Event): void {
        const target = event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        this.form.patchValue({image: file});
        this.form.get('image')?.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }
}