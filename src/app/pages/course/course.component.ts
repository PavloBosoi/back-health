import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { TermService } from '../../shared/services/term/term.service';
import { ISubCourse } from '../../core/domain/isubcourse';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { TimeType } from '../../core/domain/enumeration/time-type.enum';
import { MONTH_DAYS_COUNT, WEEK_DAYS_COUNT } from '../../app.constants';
import { ITerm } from '../../core/domain/iterm';
import { procedureBreakValidator } from '../../shared/validators/procedure-break.validator';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class CourseComponent implements OnInit, OnDestroy {
    public subCourseFormGroup: FormGroup;
    public subCourses: ISubCourse[] = [];

    public procedureBreakFormControl: FormGroup;
    public procedureBreakValidators: ValidatorFn[];

    private destroyed$ = new Subject<void>();

    constructor(
        private termService: TermService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.updateProcedureBreak();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private initForm() {
        this.subCourseFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required]),
            duration: this.termService.createTermFormGroup(),
            break: this.termService.createTermFormGroup(),
            procedureCount: this.termService.createTermFormGroup(),
            startDate: new FormControl('', [Validators.required])
        });
        this.procedureBreakFormControl = this.termService.createTermFormGroup();
        this.subCourseFormGroup.addControl('procedureBreak', this.procedureBreakFormControl);
        this.procedureBreakValidators = [procedureBreakValidator(this.subCourseFormGroup.get('procedureCount'))];
    }

    private updateProcedureBreak() {
        this.subCourseFormGroup.get('procedureCount').valueChanges.pipe(
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            this.procedureBreakFormControl.get('count').updateValueAndValidity();
        });
    }

    public submitForm() {
        // if it is the next subcourse we need calculate its startDate(considering the break)
        if (this.subCourses.length) {
            const previousSubCourseEndDate = this.subCourses[this.subCourses.length - 1].endDate;
            const startDateForCurrentSubCourse = new Date(new Date(previousSubCourseEndDate).setDate(previousSubCourseEndDate.getDate() + +((this.subCourseFormGroup.get('break').value) as ITerm).count));
            this.subCourseFormGroup.get('startDate').setValue(startDateForCurrentSubCourse);
        }

        const subCourse: ISubCourse = {
            ...this.subCourseFormGroup.value,
            dates: this.getSubCourseDates(this.subCourseFormGroup.value),
            endDate: this.getSubCourseEndDate(this.subCourseFormGroup.value)
        };
        this.subCourses.push(subCourse);
        // this.subCourseFormGroup.reset();
        console.log(this.subCourses);
/*        console.log(this.subCourseFormGroup);
        debugger*/
    }

    private getSubCourseDates(subCourse: ISubCourse) {
        const subCourseDates: Date[] = [];
        const subCourseMonthDay: number = subCourse.startDate.getDate();
        const subCourseProcedureBreakCountDays: number = +subCourse.procedureBreak.count;
        const subCourseProcedureCountDays: number = +subCourse.procedureCount.count;
        const subCourseProcedureCountType: TimeType = subCourse.procedureCount.type;
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
                // console.log('getSubCourseDuration', this.getSubCourseDuration(subCourse.duration));
                // add 1 day for break correct date
                for (let i = 0; i < this.getSubCourseDuration(subCourse.duration); i += subCourseProcedureBreakCountDays + 1) {
                    // console.log(procedureCounter, subCourseProcedureCountDays, i);
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

    public getTermTypes(countPerPeriod: ITerm) {
        if (countPerPeriod.count > 1) {
            switch (countPerPeriod.type) {
                case TimeType.WEEK:
                    return [TimeType.DAY];
                case TimeType.MONTH:
                    return [TimeType.DAY, TimeType.WEEK];
            }
        }
    }

    myFilter = (d: Date): boolean => {
        if (this.subCourses && this.subCourses.length) {
            for (const subCourse of this.subCourses) {
                return !subCourse.dates.some((date: Date) => date.getTime() === d.getTime());
            }
        }
        return true;
    }
}
