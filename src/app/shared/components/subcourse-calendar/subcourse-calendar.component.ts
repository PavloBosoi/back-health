import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';

import { ICourse } from '../../../core/domain/models/course.model';
import { ISubCourse } from '../../../core/domain/isubcourse';
import { STRING_EMPTY } from '../../../app.constants';
import { CoursesService } from '../../services/courses/courses.service';

@Component({
    selector: 'app-subcourse-calendar',
    templateUrl: './subcourse-calendar.component.html',
    styleUrls: ['./subcourse-calendar.component.scss']
})
export class SubcourseCalendarComponent implements OnInit {
    public course: ICourse = this.route.snapshot.data['course'];

    @Output()
    public delete: EventEmitter<string> = new EventEmitter();
    @Output()
    public edit: EventEmitter<string> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private coursesService: CoursesService
    ) { }

    ngOnInit(): void {
    }

    public setCompleteDates(event: Date, calendar: MatCalendar<Date>, subCourse: ISubCourse) {
        if (!this.isSameDate(subCourse.completedDates, event)) {
            subCourse.completedDates.push(event);
        } else {
            subCourse.completedDates.splice(this.getDateIndex(subCourse.completedDates, event), 1);
        }
        this.coursesService.updateCourse(this.course).subscribe(() => calendar.updateTodaysDate());
    }

    public getDateClass(subCourse: ISubCourse): MatCalendarCellCssClasses {
        return (calendarDate: Date): MatCalendarCellCssClasses => {
            const subCourseDatesClass = this.isSameDate(subCourse.dates, calendarDate) ? 'special-date' : STRING_EMPTY;
            const subCourseCompletedDatesClass = this.isSameDate(subCourse.completedDates, calendarDate) ? 'completed-date' : STRING_EMPTY;
            return [subCourseDatesClass, subCourseCompletedDatesClass];
        };
    }

    public getDisabledDates(subCourse: ISubCourse) {
        return (calendarDate: Date): boolean => {
            return this.isSameDate(subCourse.dates, calendarDate);
        };
    }

    public deleteSubCourse(id: string) {
        // const subCourseIndex = this.course.subCourses.findIndex((subCourse: ISubCourse) => subCourse.id === id);
        this.delete.emit(id);
        // this.course.subCourses.splice(subCourseIndex, 1);
        // this.coursesService.updateCourse(this.course).subscribe();
    }

    public editSubCourse(id: string) {
        // const subCourseIndex = this.course.subCourses.findIndex((subCourse: ISubCourse) => subCourse.id === id);
        this.edit.emit(id);
        // this.course.subCourses.splice(subCourseIndex, 1);
        // this.coursesService.updateCourse(this.course).subscribe();
    }

    private isSameDate(dates: Date[], compareDate: Date): boolean {
        return dates.some((date: Date) => date.getTime() === compareDate.getTime());
    }

    private getDateIndex(dates: Date[], searchDate: Date): number {
        return dates.findIndex((date: Date) => date.getTime() === searchDate.getTime());
    }

}
