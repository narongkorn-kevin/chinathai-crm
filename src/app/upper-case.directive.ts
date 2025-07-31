import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[ashaUpperCase]',
  standalone: true
})
export class UpperCaseDirective {
  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}
