import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token!: string | undefined;
    private authStatusListener = new BehaviorSubject<boolean>(false); 
    private tokerTimer!: any;

    constructor(private http: HttpClient, private router: Router){}

    getToken(): string | undefined{
      return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string): void {
        const authData: AuthData = { email: email, password: password };
        this.http.post<AuthData>("http://localhost:3000/api/user/signup", authData)
        .subscribe(response => {
            this.router.navigate(['/login']);
        });
    }


    login(email: string, password: string): void {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
        .subscribe(response => {
            this.token = response.token;
            if(this.token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(this.token, expirationDate);
                this.router.navigate(['/']);
            }
        });
    }

    logout(): void {
        this.token = undefined;
        this.authStatusListener.next(false);
        clearTimeout(this.tokerTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    autoAuthUser(): void {
       const authInformation: {token: string, expirationDate: Date} | undefined = this.getAuthData();
       if(!authInformation) return;
       const now = new Date();
       let expiresIn!: number;
       if (authInformation?.expirationDate && now) {
            expiresIn = authInformation.expirationDate.getTime() - now.getTime(); 
       }
       
       if (expiresIn > 0) {
        this.token = authInformation?.token;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
       }
    }

    private setAuthTimer(duration: number): void {
        this.tokerTimer = setTimeout(() => {
            this.logout();
         }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date) {
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expirationDate.toISOString());

    }

    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData(): {token: string, expirationDate: Date} | undefined {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if(!token || !expirationDate) return;
        return {
            token,
            expirationDate: new Date(expirationDate)
        }
    }
}