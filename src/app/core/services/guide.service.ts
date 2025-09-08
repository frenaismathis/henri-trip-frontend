import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService, User } from './auth.service';
import { environment } from '../../../environments/environment';

export interface Activity {
    id: string;
    title: string;
    description: string;
    category: string;
    address: string;
    phone?: string;
    openingHours?: string;
    website?: string;
    dayNumber: number;
    orderInDay: number;
}

export interface Guide {
    id: string;
    title: string;
    description?: string;
    daysCount: number;
    mobilityOptions: string[];
    seasons: string[];
    audiences: string[];
    activities?: Activity[];
}

@Injectable({
    providedIn: 'root'
})
export class GuideService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = environment.apiUrl + '/guides';

    getVisibleGuides(): Observable<Guide[]> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) return of([]);
                return this.http.get<Guide[]>(`${this.apiUrl}/visible/${user.id}`);
            })
        );
    }

    getGuideById(guideId: string): Observable<Guide> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) return throwError(() => new Error('Utilisateur non connecté'));
                return this.http.get<Guide>(`${this.apiUrl}/${guideId}/forUser/${user.id}`);
            })
        );
    }

    getActivities(guideId: string, dayNumber?: number): Observable<Activity[]> {
        const params: any = {};
        if (dayNumber) params.dayNumber = dayNumber;
        return this.http.get<Activity[]>(`${this.apiUrl}/${guideId}/activities`, { params });
    }
}
