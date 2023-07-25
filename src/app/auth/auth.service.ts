import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token!: string | undefined;
    private authStatusListener = new BehaviorSubject<boolean>(false); 
    private userCreatedEmail = new BehaviorSubject<string>(''); 
    private tokerTimer!: any;
    private userId!: string;

    constructor(private http: HttpClient, private router: Router){}

    getToken(): string | undefined{
      return this.token;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    getUserId(): string | undefined {
        return this.userId;
    }

    getUserCreatedEmail(): Observable<string> {
        return this.userCreatedEmail.asObservable();
    }

    createUser(email: string, password: string): void {
        const authData: AuthData = { email: email, password: password };
        this.http.post<AuthData>("http://localhost:3000/api/user/signup", authData)
        .subscribe({
            next: (response:any) =>  {
                this.userCreatedEmail.next(response.result.email);
                this.router.navigate(['/']);
            },
            error: error => {
                this.authStatusListener.next(false);
            },
            
        });
    }

    login(email: string, password: string): void {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login", authData)
            .subscribe({
                next: (response) => {
                    this.token = response.token;
                    if (this.token) {
                        const expiresInDuration = response.expiresIn;
                        this.setAuthTimer(expiresInDuration);
                        this.userId = response.userId;
                        this.authStatusListener.next(true);
                        const now = new Date();
                        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                        this.saveAuthData(this.token, expirationDate, this.userId, email);
                        this.userCreatedEmail.next(email);
                        this.router.navigate(['/']);
                    }
                }
            });
    }

    logout(): void {
        this.token = undefined;
        this.authStatusListener.next(false);
        clearTimeout(this.tokerTimer);
        this.clearAuthData();
        this.userId = '';
        this.userCreatedEmail.next('');
        this.router.navigate(['/']);
    }

    autoAuthUser(): void {
       const authInformation: { token: string, expirationDate: Date, userId: string } | undefined = this.getAuthData();
       if(!authInformation) return;
       const now = new Date();
       let expiresIn!: number;
       if (authInformation?.expirationDate && now) {
            expiresIn = authInformation.expirationDate.getTime() - now.getTime(); 
       }
       
       if (expiresIn > 0) {
        this.token = authInformation?.token;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
       }
    }

    private setAuthTimer(duration: number): void {
        this.tokerTimer = setTimeout(() => {
            this.logout();
         }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string, email:string) {
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expirationDate.toISOString());
            localStorage.setItem('userId',userId);
            localStorage.setItem('email',email);

    }

    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
    }

    private getAuthData(): {token: string, expirationDate: Date, userId: string  }  | undefined {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if(!token || !expirationDate) return;
        if (token && expirationDate && userId) {
            return {
                token,
                expirationDate: new Date(expirationDate),
                userId
            }
        }
        return undefined;
    }
}