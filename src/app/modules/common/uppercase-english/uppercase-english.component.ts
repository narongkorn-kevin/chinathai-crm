import { Component } from '@angular/core';
import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appUppercaseEnglish]',
    standalone: true
  })
export class UppercaseEnglishDirective  {
    constructor(private control: NgControl) {}

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      const start = input.selectionStart;
      const end = input.selectionEnd;

      // เปลี่ยนเฉพาะตัวอักษรภาษาอังกฤษเป็นตัวพิมพ์ใหญ่
      const regex = /[a-zA-Z]/g;
      const value = input.value;
      const newValue = value.replace(regex, (match) => match.toUpperCase());

      // ถ้ามีการเปลี่ยนแปลงค่า ให้อัพเดต value ของ control
      if (value !== newValue) {
        this.control.control.setValue(newValue, { emitEvent: false });

        // รักษาตำแหน่ง cursor
        setTimeout(() => {
          input.setSelectionRange(start, end);
        }, 0);
      }
    }
}
