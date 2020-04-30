import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

import { STRING_EMPTY } from '../../app.constants';

@Directive({
    selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
    @Input('appOnlyNumbers')
    someValue: boolean; // directive input value

    constructor(private element: ElementRef, private control: NgControl) {}

    @HostListener('input')
    onInput() {
        this.setValueToElement();
    }

    private setValueToElement() {
        this.control.control
            ? this.control.control.setValue(this.checkNumber(this.control.control.value))
            : this.element.nativeElement.value = this.checkNumber(this.element.nativeElement.value);
    }

    private checkNumber(value: string): string {
        const regex = /\d{1,3}/g; // any no more than 3 numbers
        const match = value.match(regex) ? value.match(regex)[0] : STRING_EMPTY;
        return value ? match : STRING_EMPTY;
    }
}
