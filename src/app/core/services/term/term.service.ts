import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITerm } from '../../domain/iterm';
import { TimeType } from '../../domain/enumeration/time-type.enum';

@Injectable({
    providedIn: 'root'
})
export class TermService {

    constructor() { }

    public createTermFormGroup(term?: ITerm): FormGroup {
        term = term ? term : this.createEmptyTerm();
        return new FormGroup({
            count: new FormControl(term.count, [Validators.required]),
            type: new FormControl(term.type, []),
        });
    }

    private createEmptyTerm(): ITerm {
        return {
            count: null,
            type: TimeType.DAY
        };
    }

}
