// dialog-setting.component.ts
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DeliveryService } from '../delivery.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-shipment-dialog',
    templateUrl: './dialog-setting.component.html',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatDatepickerModule,
        MatDialogModule,
    ],
})
export class DialogSettingComponent {
    shipmentForm: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    constructor(
        private dialogRef: MatDialogRef<DialogSettingComponent>,
        private fb: FormBuilder,
        private http: HttpClient,
        private fuseConfirmationService: FuseConfirmationService,
        private _service: DeliveryService,
        private toastr: ToastrService,
        private _router: Router,
    ) {
        this.shipmentForm = this.fb.group({
            shipments: this.fb.array([]),
        });
        this.addItem();
    }

    get shipmentList() {
        return this.shipmentForm.get('shipments') as FormArray;
    }

    newShipment(): FormGroup {
        return this.fb.group({
            type: ['Car', Validators.required],
            delivery_time_start: ['', Validators.required],
            delivery_time_end: ['', Validators.required],
            day_to_start: [2, [Validators.required, Validators.min(1)]],
        });
    }

    addItem() {
        this.shipmentList.push(this.newShipment());
    }

    removeItem(index: number) {
        this.shipmentList.removeAt(index);
    }

    submitData() {
        if (this.shipmentForm.valid) {
            const formattedData = this.shipmentList.value.map((item: any) => ({
                type: item.type,
                delivery_time_start: this.formatDate(item.delivery_time_start),
                delivery_time_end: this.formatDate(item.delivery_time_end),
                day_to_start: item.day_to_start,
            }));

            const confirmation = this.fuseConfirmationService.open({
                title: 'คุณแน่ใจหรือไม่ว่าต้องการสร้างรายการ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'warn',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ยืนยัน',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: false,
            });

            confirmation.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._service.create(formattedData).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('บันทึกข้อมูลสำเร็จ');
                            this.dialogRef.close();
                        },
                        error: (err) => {
                            this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                        },
                    });
                }
            });
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString)
            .toISOString()
            .replace('T', ' ')
            .split('.')[0];
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
