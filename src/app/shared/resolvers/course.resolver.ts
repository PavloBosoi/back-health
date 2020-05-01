import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICourse } from '../../core/domain/models/course.model';
import { CoursesService } from '../services/courses/courses.service';

@Injectable({
    providedIn: 'root'
})
export class CourseResolver implements Resolve<ICourse>{
    constructor(
        private coursesService: CoursesService
    ) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICourse> | Promise<ICourse> | ICourse {
        return this.coursesService.getCourseById(route.params.id);
    }

}
