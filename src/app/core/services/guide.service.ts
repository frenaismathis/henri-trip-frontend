import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model';
import { Activity } from '../../shared/models/activity.model';
import { Guide } from '../../shared/models/guide.model';
import { environment } from '../../../environments/environment';

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
                if (!user) return throwError(() => new Error('User not logged in'));
                return this.http.get<Guide>(`${this.apiUrl}/${guideId}/forUser/${user.id}`);
            })
        );
    }

    getActivities(guideId: string, dayNumber?: number): Observable<Activity[]> {
        const params: any = {};
        if (dayNumber) params.dayNumber = dayNumber;
        return this.http.get<Activity[]>(`${this.apiUrl}/${guideId}/activities`, { params });
    }

    getActivityById(guideId: string, activityId: string): Observable<Activity> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) return throwError(() => new Error('User not logged in'));
                return this.http.get<Activity>(`${this.apiUrl}/${guideId}/activities/${activityId}`);
            })
        );
    }
}
