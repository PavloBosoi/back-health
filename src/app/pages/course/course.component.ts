import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TermService } from '../../core/services/term/term.service';
import { ICourse } from '../../core/domain/icourse';
import { ISubCourse } from '../../core/domain/isubcourse';
import { ProcedureService } from '../../core/services/procedure/procedure.service';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
    public subCourseFormGroup: FormGroup;
    public subCourses: ISubCourse[] = [];

    datesToHighlight = ["2020-04-22T18:30:00.000Z", "2020-04-13T18:30:00.000Z", "2019-01-24T18:30:00.000Z", "2019-01-28T18:30:00.000Z", "2019-01-24T18:30:00.000Z", "2019-01-23T18:30:00.000Z", "2019-01-22T18:30:00.000Z", "2019-01-25T18:30:00.000Z"];

    constructor(
        private termService: TermService,
        private procedureService: ProcedureService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.subCourseFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required]),
            duration: this.termService.createTermFormGroup(),
            break: this.termService.createTermFormGroup(),
            procedure: this.procedureService.createProcedureFormGroup(),
            startDate: new FormControl('', [Validators.required])
        });
    }

    public submitForm() {
        const subCourse: ISubCourse = {
            ...this.subCourseFormGroup.value,
            dates: this.getSubCourseDates(this.subCourseFormGroup.value)
        };
        this.subCourses.push(subCourse);
        console.log(this.subCourses);
    }

    private getSubCourseDates(subCourse: ISubCourse) {
        const subCourseDates: Date[] = [];
        for (let i = 0; i < subCourse.duration.count; i++) {
            subCourseDates.push(new Date(new Date().setDate(subCourse.startDate.getDate() + i)));
        }
        return subCourseDates;
    }

    select(event: Date, calendar: MatCalendar<Date>) {
        console.log(calendar.selected);
/*        const date = event.getFullYear() + '-' + ('00' + (event.getMonth() + 1)).slice(-2) + '-' + ('00' + event.getDate()).slice(-2);
        console.log(date);
        const index = this.daysSelected.findIndex(x => {
            console.log(x);
            return x == date;
        });
        if (index < 0) {
            this.daysSelected.push(date);
        } else {
            this.daysSelected.splice(index, 1);
        }*/

        calendar.updateTodaysDate();
    }

    public dateClass(subCourse: ISubCourse) {
        return (date: Date): MatCalendarCellCssClasses => {
            // console.log(subCourse);
            console.log('Date', date);
            const highlightDate = subCourse.dates
                .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());

            return highlightDate ? 'special-date' : '';
        };
    }

}
