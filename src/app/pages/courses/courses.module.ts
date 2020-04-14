import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CoursesComponent } from './courses.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { CreateCourseComponent } from './modals/create-course/create-course.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    declarations: [CoursesComponent, CreateCourseComponent],
    imports: [
        CommonModule,
        CoursesRoutingModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        A11yModule
    ]
})
export class CoursesModule { }
