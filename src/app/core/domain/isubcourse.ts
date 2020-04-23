import { ITerm } from './iterm';
import { IProcedure } from './iprocedure';

export interface ISubCourse {
    name: string;
    duration: ITerm;
    break?: ITerm;
    procedure: IProcedure;
    startDate: Date;
    endDate: Date;
    dates: Date[];
    completedDates: Date[];
}
