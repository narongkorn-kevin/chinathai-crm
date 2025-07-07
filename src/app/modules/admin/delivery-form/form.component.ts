import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './import-material';

@Component({
    standalone: true,
    selector: 'app-shipping-form',
    imports: [CommonModule, ReactiveFormsModule, MaterialModule],
    templateUrl: './form.component.html',
})
export class ShippingFormComponent {
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    clientData = [
        { id: 1, code: 'THEBESTCARGO', name: 'เดอะเบสท์คาร์โก้' },
        { id: 2, code: 'THAIEXPRESS', name: 'ไทยเอ็กซ์เพรส' },
        { id: 3, code: 'FASTMOVE', name: 'ฟาสต์มูฟ โลจิสติกส์' },
        { id: 4, code: 'WINDELIVERY', name: 'วิน เดลิเวอรี่' },
        { id: 5, code: 'PROSPACK', name: 'พรอสแพ็ค ขนส่ง' },
        { id: 6, code: 'GOTRANSPORT', name: 'โกทรานสปอร์ต' },
        { id: 7, code: 'KERRYTH', name: 'เคอรี่ ไทยแลนด์' },
        { id: 8, code: 'NIMEXPRESS', name: 'นิ่มเอ็กซ์เพรส' },
        { id: 9, code: 'SPEEDPOST', name: 'สปีดโพสต์ โลจิสติกส์' },
        { id: 10, code: 'JNTEXPRESS', name: 'เจแอนด์ที เอ็กซ์เพรส' }
    ];
    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            vendor: ['THEBESTCARGO'],
            shipments: this.fb.array([this.createShipment()]),
            fileOption: [''],
            location: [''],
            carrier: [''],
            note: ['']
        });
    }


    get shipments(): FormArray {
        return this.form.get('shipments') as FormArray;
    }

    createShipment(): FormGroup {
        return this.fb.group({
            productName: [''],
            totalQty: [''],
            totalTypes: [''],
            unit: [''],
            weight: [''],
            remark: ['']
        });
    }

    addShipment() {
        this.shipments.push(this.createShipment());
    }

    removeShipment(index: number) {
        this.shipments.removeAt(index);
    }
}
