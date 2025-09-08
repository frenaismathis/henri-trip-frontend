import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, AsyncPipe],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    private auth = inject(AuthService);
    private router = inject(Router);

    currentUser$: Observable<User | null> = this.auth.currentUser$;

    logout(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
