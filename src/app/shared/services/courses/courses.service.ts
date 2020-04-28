import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ICourse } from '../../../core/domain/icourse';
import { environment } from '../../../../environments/environment';
import { IFBCourseDTO } from '../../../core/domain/IfbcourseDTO';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private readonly coursesDBUrl = `${environment.firebaseDbUrl}/courses.json`;

    constructor(private http: HttpClient) { }

    public createCourse(course: ICourse): Observable<ICourse> {
        return this.http.post<ICourse>(this.coursesDBUrl, course).pipe(
            map((fbCourseDTO: IFBCourseDTO) => {
                return {
                    ...course,
                    id: fbCourseDTO.name
                };
            }),
            take(1)
        );
    }

    public getCourses(): Observable<ICourse[]> {
        return this.http.get<ICourse[]>(this.coursesDBUrl).pipe(
            map((result: {[key: string]: any}) => {
                return Object.keys(result).map((key: string) => {
                    return {
                        ...result[key],
                        id: key
                    };
                });
            }),
            take(1)
        );
    }
}
