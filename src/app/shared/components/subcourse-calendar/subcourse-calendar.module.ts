import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { SubcourseCalendarComponent } from './subcourse-calendar.component';

@NgModule({
    declarations: [
        SubcourseCalendarComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    exports: [
        SubcourseCalendarComponent
    ]
})
export class SubcourseCalendarModule { }
