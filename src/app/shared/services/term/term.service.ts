import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITerm } from '../../../core/domain/iterm';
import { TimeType } from '../../../core/domain/enumeration/time-type.enum';
import { ValidateFn } from 'codelyzer/walkerFactory/walkerFn';

@Injectable({
    providedIn: 'root'
})
export class TermService {

    constructor() { }

    public createTermFormGroup(): FormGroup {
        const term = this.createEmptyTerm();
        return new FormGroup({
            count: new FormControl(term.count, [Validators.required]),
            type: new FormControl(term.type, []),
        });
    }

    public createEmptyTerm(): ITerm {
        return {
            count: null,
            type: TimeType.DAY
        };
    }

}
