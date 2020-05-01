import { ITerm } from './iterm';

export interface ISubCourse {
    name: string;
    duration: ITerm;
    break?: ITerm;
    procedureCount: ITerm;
    procedureBreak?: ITerm;
    startDate: Date;
    endDate: Date;
    dates: Date[];
    completedDates: Date[];
}

export interface ISubCourseDTO {
    name: string;
    duration: ITerm;
    break?: ITerm;
    procedureCount: ITerm;
    procedureBreak?: ITerm;
    startDate: string;
    endDate: string;
    dates: string[];
    completedDates: string[];
}
