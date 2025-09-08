import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    role: string;
    email: string;
}

interface LoginResponse {
    token: string;
    email: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'henri_token';
    private readonly USER_KEY = 'henri_user';
    private readonly apiUrl = environment.apiUrl;

    private currentUserSubject: BehaviorSubject<User | null>;

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem(this.USER_KEY);
        this.currentUserSubject = new BehaviorSubject<User | null>(
            storedUser ? JSON.parse(storedUser) : null
        );
    }

    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    login(credentials: { email: string; password: string }): Observable<User> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap(res => {
                if (!res.token) throw new Error('Token manquant dans la réponse du backend');
                localStorage.setItem(this.TOKEN_KEY, res.token);
            }),
            switchMap(() =>
                this.http.get<User>(`${this.apiUrl}/users/me`).pipe(
                    tap(user => {
                        if (!user.id) throw new Error('User.id manquant dans /users/me');
                        // Stocke l’objet complet en JSON
                        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    })
                )
            )
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
