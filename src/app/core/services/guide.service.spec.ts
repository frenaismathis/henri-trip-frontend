import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { GuideService } from './guide.service';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model';
import { Guide } from '../../shared/models/guide.model';
import { Activity } from '../../shared/models/activity.model';
import { environment } from '../../../environments/environment';

describe('GuideService', () => {
    let service: GuideService;
    let httpMock: HttpTestingController;
    let currentUserSubject: BehaviorSubject<User | null>;

    const apiUrl = environment.apiUrl + '/guides';
    const user: User = {
        id: 'user-1',
        firstname: 'Jane',
        lastname: 'Doe',
        role: 'user',
        email: 'jane@example.com'
    };

    beforeEach(() => {
        currentUserSubject = new BehaviorSubject<User | null>(null);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AuthService, useValue: { currentUser$: currentUserSubject.asObservable() } }
            ]
        });

        service = TestBed.inject(GuideService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('getVisibleGuides', () => {
        it('returns an empty array without an HTTP request when there is no user', () => {
            currentUserSubject.next(null);
            let result: Guide[] | undefined;

            service.getVisibleGuides().subscribe(guides => (result = guides));

            expect(result).toEqual([]);
            httpMock.expectNone(`${apiUrl}/visible/${user.id}`);
        });

        it('requests the visible guides for the current user and maps the response', () => {
            currentUserSubject.next(user);
            const expectedGuides: Guide[] = [
                { id: 'g1', title: 'Guide 1', daysCount: 2, mobilityOptions: [], seasons: [], audiences: [] }
            ];
            let result: Guide[] | undefined;

            service.getVisibleGuides().subscribe(guides => (result = guides));

            const req = httpMock.expectOne(`${apiUrl}/visible/${user.id}`);
            expect(req.request.method).toBe('GET');
            req.flush(expectedGuides);

            expect(result).toEqual(expectedGuides);
        });
    });

    describe('getGuideById', () => {
        it('throws an error without making a request when there is no user', () => {
            currentUserSubject.next(null);
            let error: Error | undefined;

            service.getGuideById('g1').subscribe({
                error: err => (error = err)
            });

            expect(error?.message).toBe('User not logged in');
            httpMock.expectNone(`${apiUrl}/g1/forUser/${user.id}`);
        });

        it('requests the guide for the current user', () => {
            currentUserSubject.next(user);
            const expectedGuide: Guide = {
                id: 'g1',
                title: 'Guide 1',
                daysCount: 2,
                mobilityOptions: [],
                seasons: [],
                audiences: []
            };
            let result: Guide | undefined;

            service.getGuideById('g1').subscribe(guide => (result = guide));

            const req = httpMock.expectOne(`${apiUrl}/g1/forUser/${user.id}`);
            expect(req.request.method).toBe('GET');
            req.flush(expectedGuide);

            expect(result).toEqual(expectedGuide);
        });
    });

    describe('getActivities', () => {
        it('does not send the dayNumber param when it is not provided', () => {
            service.getActivities('g1').subscribe();

            const req = httpMock.expectOne(req => req.url === `${apiUrl}/g1/activities`);
            expect(req.request.method).toBe('GET');
            expect(req.request.params.has('dayNumber')).toBeFalse();
            req.flush([]);
        });

        it('sends the dayNumber param when it is provided', () => {
            service.getActivities('g1', 3).subscribe();

            const req = httpMock.expectOne(req => req.url === `${apiUrl}/g1/activities`);
            expect(req.request.method).toBe('GET');
            expect(req.request.params.get('dayNumber')).toBe('3');
            req.flush([]);
        });
    });

    describe('getActivityById', () => {
        it('throws an error without making a request when there is no user', () => {
            currentUserSubject.next(null);
            let error: Error | undefined;

            service.getActivityById('g1', 'a1').subscribe({
                error: err => (error = err)
            });

            expect(error?.message).toBe('User not logged in');
            httpMock.expectNone(`${apiUrl}/g1/activities/a1`);
        });

        it('requests the activity by id for the current user', () => {
            currentUserSubject.next(user);
            const expectedActivity: Activity = {
                id: 'a1',
                title: 'Activity 1',
                description: 'desc',
                category: 'cat',
                address: 'addr',
                dayNumber: 1,
                orderInDay: 1
            };
            let result: Activity | undefined;

            service.getActivityById('g1', 'a1').subscribe(activity => (result = activity));

            const req = httpMock.expectOne(`${apiUrl}/g1/activities/a1`);
            expect(req.request.method).toBe('GET');
            req.flush(expectedActivity);

            expect(result).toEqual(expectedActivity);
        });
    });
});
