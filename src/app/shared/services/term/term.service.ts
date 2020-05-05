import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITerm } from '../../../core/domain/iterm';
import { TimeType } from '../../../core/domain/enumeration/time-type.enum';

@Injectable({
    providedIn: 'root'
})
export class TermService {

    constructor() { }

    public createTermFormGroup(): FormGroup {
        const term = this.createTerm();
        return new FormGroup({
            count: new FormControl(term.count, [Validators.required]),
            type: new FormControl(term.type, []),
        });
    }

    public createTerm(term?: ITerm): ITerm {
        return {
            count: term && term.count ? term.count : null,
            type: term && term.type ? term.type : TimeType.DAY
        };
    }

}
