import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { IProcedure } from '../../domain/iprocedure';
import { TermService } from '../term/term.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {

  constructor(
      private termService: TermService
  ) { }

    public createProcedureFormGroup(procedure?: IProcedure): FormGroup {
        procedure = procedure ? procedure : this.createEmptyProcedure();
        return new FormGroup({
            count: this.termService.createTermFormGroup(procedure.count),
            break: this.termService.createTermFormGroup(procedure.break)
        });
    }

    private createEmptyProcedure(): IProcedure {
        return {
            count: this.termService.createEmptyTerm(),
            break: this.termService.createEmptyTerm()
        };
    }
}
