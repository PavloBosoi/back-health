import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TermService } from '../../core/services/term/term.service';
import { ICourse } from '../../core/domain/icourse';
import { ISubCourse } from '../../core/domain/isubcourse';
import { ProcedureService } from '../../core/services/procedure/procedure.service';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { TimeType } from '../../core/domain/enumeration/time-type.enum';
import { MONTH_DAYS_COUNT, WEEK_DAYS_COUNT } from '../../app.constants';
import { ITerm } from '../../core/domain/iterm';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
    public subCourseFormGroup: FormGroup;
    public subCourses: ISubCourse[] = [];

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
            dates: this.getSubCourseDates(this.subCourseFormGroup.value),
            endDate: this.getSubCourseEndDate(this.subCourseFormGroup.value)
        };
        this.subCourses.push(subCourse);
        console.log(this.subCourses);
    }

    private getSubCourseDates(subCourse: ISubCourse) {
        const subCourseDates: Date[] = [];
        const subCourseMonthDay: number = subCourse.startDate.getDate();
        const subCourseProcedureBreakCountDays: number = +subCourse.procedure.break.count;
        const subCourseProcedureCountDays: number = +subCourse.procedure.count.count;
        const subCourseProcedureCountType: TimeType = subCourse.procedure.count.type;
        let procedureCounter = 0;
        switch (subCourseProcedureCountType) {
            case TimeType.DAY:
                for (let i = 0; i < this.getSubCourseDuration(subCourse.duration); i++) {
                    subCourseDates.push(new Date(new Date(subCourse.startDate).setDate(subCourseMonthDay + i)));
                }
                break;
            case TimeType.WEEK:
                console.log('getSubCourseDuration', this.getSubCourseDuration(subCourse.duration));
                // add 1 day for break correct date
                for (let i = 0; i < this.getSubCourseDuration(subCourse.duration); i += subCourseProcedureBreakCountDays + 1) {
                    console.log(procedureCounter, subCourseProcedureCountDays, i);
                    if (procedureCounter === subCourseProcedureCountDays) {
                        // week days - current iteration break - (all procedure days + all break days)
                        i += WEEK_DAYS_COUNT - (subCourseProcedureBreakCountDays + 1) - (subCourseProcedureCountDays + subCourseProcedureBreakCountDays * subCourseProcedureCountDays);
                        procedureCounter = 0;
                    } else {
                        subCourseDates.push(new Date(new Date(subCourse.startDate).setDate(subCourseMonthDay + i)));
                        procedureCounter++;
                    }
                }
                break;
            case TimeType.MONTH:
                console.log('getSubCourseDuration', this.getSubCourseDuration(subCourse.duration));
                // add 1 day for break correct date
                for (let i = 0; i < this.getSubCourseDuration(subCourse.duration); i += subCourseProcedureBreakCountDays + 1) {
                    console.log(procedureCounter, subCourseProcedureCountDays, i);
                    if (procedureCounter === subCourseProcedureCountDays) {
                        // week days - current iteration break - (all procedure days + all break days)
                        i += MONTH_DAYS_COUNT - (subCourseProcedureBreakCountDays + 1) - (subCourseProcedureCountDays + subCourseProcedureBreakCountDays * subCourseProcedureCountDays);
                        procedureCounter = 0;
                    } else {
                        subCourseDates.push(new Date(new Date(subCourse.startDate).setDate(subCourseMonthDay + i)));
                        procedureCounter++;
                    }
                }
                break;
            default:
                console.log('TimeType default');
        }
        return subCourseDates;
    }

    private getSubCourseDuration(duration: ITerm) {
        const durationCountDays: number = +duration.count;
        switch (duration.type) {
            case TimeType.WEEK:
                return durationCountDays * WEEK_DAYS_COUNT;
            case TimeType.MONTH:
                return durationCountDays * MONTH_DAYS_COUNT;
            default:
                return durationCountDays;
        }
    }

    private getSubCourseEndDate(subCourse: ISubCourse) {
        const subCourseDurationType: TimeType = subCourse.duration.type;
        switch (subCourseDurationType) {
            // -1 day for include current day to duration
            case TimeType.DAY:
                return new Date(new Date(subCourse.startDate).setDate(subCourse.startDate.getDate() + +subCourse.duration.count - 1));
            case TimeType.WEEK:
                return new Date(new Date(subCourse.startDate).setDate(subCourse.startDate.getDate() + (+subCourse.duration.count * WEEK_DAYS_COUNT) - 1));
            case TimeType.MONTH:
                return new Date(new Date(subCourse.startDate).setDate(subCourse.startDate.getDate() + (+subCourse.duration.count * MONTH_DAYS_COUNT) - 1));
            default:
                console.log('TimeType default');
        }
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
            // console.log('Date', date);
            const highlightDate = subCourse.dates.some((d: Date) => {
                return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
            });

            return highlightDate ? 'special-date' : '';
        };
    }

}
