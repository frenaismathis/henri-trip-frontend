import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../../shared/models/user.model';

describe('authGuard', () => {
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const user: User = {
        id: 'user-1',
        firstname: 'Jane',
        lastname: 'Doe',
        role: 'user',
        email: 'jane@example.com'
    };

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });
    });

    function runGuard() {
        return TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    }

    it('allows navigation and does not redirect when a user is logged in', () => {
        authServiceSpy.getCurrentUser.and.returnValue(user);

        const result = runGuard();

        expect(result).toBeTrue();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('blocks navigation and redirects to /login when there is no user', () => {
        authServiceSpy.getCurrentUser.and.returnValue(null);

        const result = runGuard();

        expect(result).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
});
