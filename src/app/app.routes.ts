import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { GuideListComponent } from './features/guides/guide-list/guide-list.component';
import { GuideDetailComponent } from './features/guides/guide-detail/guide-detail.component';
import { ActivityDetailComponent } from './features/activities/activity-detail/activity-detail.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'guides', component: GuideListComponent, canActivate: [authGuard] },
    { path: 'guides/:id', component: GuideDetailComponent, canActivate: [authGuard] },
    {
        path: 'guides/:guideId/activities/:activityId',
        component: ActivityDetailComponent,
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'login' },
];
