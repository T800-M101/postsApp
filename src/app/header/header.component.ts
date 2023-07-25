import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userCreatedEmail!: string | null;

  private authListenerSubs!: Subscription;
  private userCreatedEmailSubs!: Subscription;

  constructor(private authService:AuthService){}

  ngOnInit(): void {

    this.getEmail().then(email => {
      this.userCreatedEmail = email;
    });

   
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.userCreatedEmailSubs = this.authService.getUserCreatedEmail().subscribe( email => {
      this.userCreatedEmail = email;
    });
    
  }

  private async getEmail(): Promise<string | null>  {
    let email: string | null = '';
    if(localStorage.getItem('email')) {
        email = localStorage.getItem('email');
    }
    return email;
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.userCreatedEmailSubs.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

}
