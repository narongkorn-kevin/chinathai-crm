import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-so-order-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form.component.html'
})
export class SoOrderFormComponent {
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            soNumber: ['LO2507070060'],
            status: ['ดำเนินการชำระเงิน'],
            csNote: [''],
            taobaoUsername: ['13778139177'],
            log: [''],
            customerInfo: this.fb.group({
                code: ['195964'],
                createDate: ['2025-07-07 14:19:35'],
                updateDate: ['2025-07-07 14:59:26'],
                email: ['nachapon999@gmail.com'],
                phone: ['0994651654'],
            }),
            items: this.fb.array([
                this.createItem()
            ]),
            summary: this.fb.group({
                productY: [480],
                rate: [4.8],
                productTHB: [2304],
                chinaShipping: [0],
                handlingFee: [0],
                otherFee: [0],
                totalTHB: [2304],
                paid: [2304]
            })
        });
    }

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    createItem(): FormGroup {
        return this.fb.group({
            name: ['3M รุ่นใหม่ 2604'],
            customer: ['ลูกค้า 1'],
            length: [60],
            quantity: [6],
            weight: [0.3],
            volume: [0.6],
            priceY: [480],
            insuranceY: [0],
            remark: ['QC + ค่าชิป']
        });
    }

    addItem(): void {
        this.items.push(this.createItem());
    }

    removeItem(index: number): void {
        this.items.removeAt(index);
    }

    submit(): void {
        if (this.form.valid) {
            console.log('Form Value:', this.form.value);
        }
    }
}
