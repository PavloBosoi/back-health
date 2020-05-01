import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseComponent } from './course.component';
import { CourseResolver } from '../../shared/resolvers/course.resolver';

const routes: Routes = [
    {
        path: ':id',
        component: CourseComponent,
        resolve: {course: CourseResolver}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CourseRoutingModule { }
