// datetime-picker.component.ts
import {
    Component,
    forwardRef,
    Input,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-time-picker-dialog',
    standalone: true,
    imports: [TranslocoModule, CommonModule, FormsModule, MatDialogModule],
    template: `
        <div class="p-4 min-w-80">
            <h2 class="text-center text-lg font-medium mb-4">เลือกเวลา</h2>

            <div class="flex justify-center items-center space-x-2 mb-6">
                <!-- Hours -->
                <div class="flex flex-col items-center">
                    <button
                        class="p-2 hover:bg-gray-100 rounded-full"
                        (click)="incrementHours()"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </button>
                    <div
                        class="w-8 text-center font-medium border-b-2 border-red-500"
                    >
                        {{ hours }}
                    </div>
                    <button
                        class="p-2 hover:bg-gray-100 rounded-full"
                        (click)="decrementHours()"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Separator -->
                <div class="text-xl font-medium">:</div>

                <!-- Minutes -->
                <div class="flex flex-col items-center">
                    <button
                        class="p-2 hover:bg-gray-100 rounded-full"
                        (click)="incrementMinutes()"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </button>
                    <div
                        class="w-8 text-center font-medium border-b-2 border-red-500"
                    >
                        {{ minutes }}
                    </div>
                    <button
                        class="p-2 hover:bg-gray-100 rounded-full"
                        (click)="decrementMinutes()"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Separator -->
                <div class="text-xl font-medium">:</div>

                <!-- Seconds -->
                <div class="flex flex-col items-center">
                    <button
                        class="p-2 hover:bg-gray-100 rounded-full"
                        (click)="incrementSeconds()"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </button>
                    <div
                        class="w-8 text-center font-medium border-b-2 border-red-500"
                    >
                        {{ seconds }}
                    </div>
                    <button
                        class="p-2 hover:bg-gray-100 rounded-full"
                        (click)="decrementSeconds()"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-2">
                <button
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    (click)="onCancel()"
                >
                    {{ 'buttons.cancel' | transloco }}
                </button>
                <button
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    (click)="onConfirm()"
                >
                    {{ 'buttons.submit' | transloco }}
                </button>
            </div>
        </div>
    `,
})
export class TimePickerDialogComponent {
    hours = '00';
    minutes = '00';
    seconds = '00';

    constructor(private dialogRef: MatDialogRef<TimePickerDialogComponent>) {}

    incrementHours(): void {
        let hour = parseInt(this.hours);
        hour = (hour + 1) % 24;
        this.hours = this.padZero(hour);
    }

    decrementHours(): void {
        let hour = parseInt(this.hours);
        hour = (hour - 1 + 24) % 24;
        this.hours = this.padZero(hour);
    }

    incrementMinutes(): void {
        let minute = parseInt(this.minutes);
        minute = (minute + 1) % 60;
        this.minutes = this.padZero(minute);
    }

    decrementMinutes(): void {
        let minute = parseInt(this.minutes);
        minute = (minute - 1 + 60) % 60;
        this.minutes = this.padZero(minute);
    }

    incrementSeconds(): void {
        let second = parseInt(this.seconds);
        second = (second + 1) % 60;
        this.seconds = this.padZero(second);
    }

    decrementSeconds(): void {
        let second = parseInt(this.seconds);
        second = (second - 1 + 60) % 60;
        this.seconds = this.padZero(second);
    }

    padZero(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    onConfirm(): void {
        this.dialogRef.close({
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    setTime(hours: string, minutes: string, seconds: string): void {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }
}

@Component({
    selector: 'app-datetime-picker',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        FormsModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatetimePickerComponent),
            multi: true,
        },
    ],
    template: `
        <div class="relative">
            <mat-form-field [ngClass]="formFieldHelpers" class="w-full">
                <input
                    matInput
                    [value]="formattedDateTime"
                    [matDatepicker]="picker"
                    (click)="openDatepicker()"
                    [placeholder]="placeholder"
                    readonly
                />
                <mat-datepicker-toggle matIconSuffix [for]="picker">
                </mat-datepicker-toggle>
                <mat-datepicker
                    (closed)="openTimePicker()"
                    #picker
                ></mat-datepicker>
            </mat-form-field>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }
            .mat-mdc-form-field {
                width: 100%;
            }
        `,
    ],
})
export class DatetimePickerComponent implements ControlValueAccessor {
    @Input() label = 'วันที่และเวลา';
    @Input() placeholder = 'เลือกวันที่และเวลา';
    @ViewChild('picker') picker: any;

    formFieldHelpers: string[] = ['fuse-mat-dense'];

    dateValue: Date | null = null;
    hours = '00';
    minutes = '00';
    seconds = '00';

    get formattedDateTime(): string {
        if (!this.dateValue) return '';

        const year = this.dateValue.getFullYear();
        const month = this.padZero(this.dateValue.getMonth() + 1);
        const day = this.padZero(this.dateValue.getDate());

        return `${year}-${month}-${day} ${this.hours}:${this.minutes}:${this.seconds}`;
    }

    // ControlValueAccessor methods
    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(private dialog: MatDialog) {}

    writeValue(value: Date): void {
        if (value) {
            this.dateValue = value;
            this.hours = this.padZero(value.getHours());
            this.minutes = this.padZero(value.getMinutes());
            this.seconds = this.padZero(value.getSeconds());
        } else {
            this.dateValue = null;
            this.hours = '00';
            this.minutes = '00';
            this.seconds = '00';
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    openDatepicker(): void {
        this.picker.open();
    }

    openTimePicker(): void {
        // ถ้ายังไม่เลือกวันที่ ไม่ต้องเปิด time picker
        if (!this.dateValue) return;

        const dialogRef = this.dialog.open(TimePickerDialogComponent, {
            width: '320px',
            panelClass: 'time-picker-dialog',
        });

        // ตั้งค่าเวลาปัจจุบัน
        const timePickerInstance =
            dialogRef.componentInstance as TimePickerDialogComponent;
        timePickerInstance.setTime(this.hours, this.minutes, this.seconds);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.hours = result.hours;
                this.minutes = result.minutes;
                this.seconds = result.seconds;
                this.updateDateTime();
            }
        });
    }

    updateDateTime(): void {
        if (this.dateValue) {
            const date = new Date(this.dateValue);
            date.setHours(parseInt(this.hours));
            date.setMinutes(parseInt(this.minutes));
            date.setSeconds(parseInt(this.seconds));
            this.dateValue = date;
            this.onChange(date);
            this.onTouched();
        }
    }

    padZero(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }
}
