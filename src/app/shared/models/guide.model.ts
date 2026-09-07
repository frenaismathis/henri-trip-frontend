import { Activity } from './activity.model';

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
