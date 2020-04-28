import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

import { STRING_EMPTY } from '../../app.constants';

@Directive({
    selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
    @Input('appOnlyNumbers')
    someValue: boolean; // directive input value

    constructor(private el: ElementRef, private control: NgControl) {}

    @HostListener('input')
    onInput() {
        this.setValueToElement();
    }

    private setValueToElement() {
        this.control.control
            ? this.control.control.setValue(this.checkNumber(this.control.control.value))
            : (this.el.nativeElement.value = this.checkNumber(this.el.nativeElement.value));
    }

    private checkNumber(value: string): string {
        const regex = /\d*/g;
        const match = value.match(regex) ? value.match(regex)[0] : STRING_EMPTY;
        return value ? match : STRING_EMPTY;
    }
}
