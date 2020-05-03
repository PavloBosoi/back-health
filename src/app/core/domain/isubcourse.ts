import { ITerm } from './iterm';

export interface ISubCourse {
    id: string;
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
    id: string;
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
