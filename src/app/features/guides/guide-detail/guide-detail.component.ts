import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GuideService, Guide, Activity } from '../../../core/services/guide.service';
import { Observable, switchMap, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { GuideTranslations } from '../../../core/enums/guide-translations.enum';

@Component({
    selector: 'app-guide-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, AsyncPipe, MatCardModule, MatExpansionModule, MatIconModule],
    templateUrl: './guide-detail.component.html',
    styleUrls: ['./guide-detail.component.scss']
})
export class GuideDetailComponent implements OnInit {
    guide$!: Observable<Guide>;
    activitiesByDay$!: Observable<{ [day: number]: Activity[] }>;

    private route = inject(ActivatedRoute);
    private guideService = inject(GuideService);

    ngOnInit(): void {
        const guideId$ = this.route.paramMap.pipe(
            map(params => {
                const guideId = params.get('id');
                if (!guideId) throw new Error('Guide ID manquant');
                return guideId;
            })
        );

        this.guide$ = guideId$.pipe(switchMap(id => this.guideService.getGuideById(id)));

        this.activitiesByDay$ = guideId$.pipe(
            switchMap(id => this.guideService.getActivities(id)),
            map(activities => {
                const grouped: { [day: number]: Activity[] } = {};
                activities.forEach(act => {
                    if (!grouped[act.dayNumber]) grouped[act.dayNumber] = [];
                    grouped[act.dayNumber].push(act);
                });
                return grouped;
            })
        );
    }

    trackByDay(index: number, day: { key: string; value: Activity[] }) {
        return day.key;
    }

    trackByActivity(index: number, activity: Activity) {
        return activity.id;
    }

    getTranslatedMobility(mobility: string): string {
        return GuideTranslations[mobility as keyof typeof GuideTranslations] || mobility;
    }

    getTranslatedSeason(season: string): string {
        return GuideTranslations[season as keyof typeof GuideTranslations] || season;
    }

    getTranslatedAudience(audience: string): string {
        return GuideTranslations[audience as keyof typeof GuideTranslations] || audience;
    }
}
