import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GuideService, Guide } from '../../../core/services/guide.service';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GuideTranslations } from '../../../core/enums/guide-translations.enum';

@Component({
    selector: 'app-guide-list',
    standalone: true,
    imports: [CommonModule, RouterModule, AsyncPipe, MatCardModule, MatIconModule],
    templateUrl: './guide-list.component.html',
    styleUrls: ['./guide-list.component.scss']
})
export class GuideListComponent implements OnInit {
    guides$!: Observable<Guide[]>;
    private router = inject(Router);
    private guideService = inject(GuideService);

    ngOnInit(): void {
        this.guides$ = this.guideService.getVisibleGuides();
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

    goToGuide(guideId: string) {
        setTimeout(() => {
            this.router.navigate(['/guides', guideId]);
        }, 120);
    }
}
