import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GuideService, Activity } from '../../../core/services/guide.service';
import { Observable, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-activity-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, AsyncPipe, MatCardModule, MatButtonModule, MatExpansionModule, MatIconModule],
    templateUrl: './activity-detail.component.html',
    styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private guideService = inject(GuideService);

    activity$!: Observable<Activity>;
    guideId!: string;
    activityId!: string;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guideId = params.get('guideId');
            const activityId = params.get('activityId');
            if (!guideId || !activityId) throw new Error('Guide ou activité manquant');
            this.guideId = guideId;
            this.activityId = activityId;

            this.activity$ = this.guideService.getActivities(this.guideId).pipe(
                switchMap(activities => {
                    const activity = activities.find(a => a.id === this.activityId);
                    if (!activity) throw new Error('Activité introuvable');
                    return [activity];
                })
            );

            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        });
    }
}
