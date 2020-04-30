import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ITerm } from '../../core/domain/iterm';
import { TimeType } from '../../core/domain/enumeration/time-type.enum';
import { MONTH_DAYS_COUNT, WEEK_DAYS_COUNT } from '../../app.constants';

export function procedureBreakValidator(procedurePerPeriod: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const procedurePerPeriodCount = +(procedurePerPeriod.value as ITerm).count;
        const procedurePerPeriodType = (procedurePerPeriod.value as ITerm).type;
        let termDaysCount: number;
        switch (procedurePerPeriodType) {
            case TimeType.WEEK:
                termDaysCount = WEEK_DAYS_COUNT;
                break;
            case TimeType.MONTH:
                termDaysCount = MONTH_DAYS_COUNT;
                break;
        }
        // check if (procedure break + procedure count per period) is no more than procedure period
        if (control.value && procedurePerPeriod.value && ((procedurePerPeriodCount + +control.value * procedurePerPeriodCount) > termDaysCount)) {
            return { procedureBreak: { valid: false, value: control.value } };
        }
        return null;
    };
}
