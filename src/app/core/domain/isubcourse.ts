import { ITerm } from './iterm';
import { IProcedure } from './iprocedure';

export interface ISubCourse {
    name: string;
    duration: ITerm;
    break?: ITerm;
    procedures: IProcedure[];
}
