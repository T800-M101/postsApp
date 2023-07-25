import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  
  isLoading = true;

  private authStatusSub!: Subscription;

  constructor(private authService: AuthService){}
  
  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe((authStatus: boolean) => this.isLoading = false);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  
  onSignup(form:NgForm){
    if(form.invalid) return;
    
    this.authService.createUser(form.value.email, form.value.password);
    
    form.resetForm();
  }

}
