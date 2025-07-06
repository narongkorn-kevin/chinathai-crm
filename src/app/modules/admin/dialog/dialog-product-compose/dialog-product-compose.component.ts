import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogClose,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrderProductsService } from '../../order-products/order-products.service';
@Component({
    selector: 'app-dialog-product-compose',
    standalone: true,
    templateUrl: './dialog-product-compose.component.html',
    styleUrl: './dialog-product-compose.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
        FormsModule, MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatCheckboxModule
    ]
})
export class DialogProductComposeComponent implements OnInit {

    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    product: any;
    addOnServices: any[] = [];
    // options: { option_name: string, option_image: string, option_note: string }[] = [];


    selectedItems: { add_on_service_id: number, add_on_service_price: number }[] = [];

    props: any[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogProductComposeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,

    ) {
        this.addOnServices = data.addOnServices
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            product_code: [''],
            product_name: ['', Validators.required],
            product_url: ['', Validators.required],
            product_image: [''],
            product_category: [''],
            product_store_type: [''],
            product_note: [''],
            product_price: [null, Validators.required],
            product_qty: [null, Validators.required],
            options: this.fb.array([])
        });

        // this.form.patchValue({
        //     product_name: 'Test',
        //     product_price: 100,
        //     product_qty: 10,
        // })
    }

    get options(): FormArray {
        return this.form.get('options') as FormArray;
    }

    removeOption(index: number): void {
        this.options.removeAt(index);
    }

    addOption() {
        const form = this.fb.group({
            option_name: ['', Validators.required],
            option_image: [],
            option_note: []
        })

        this.options.push(form);
    }

    toggleItem(itemId: number, itemPrice: number): void {
        const index = this.selectedItems.findIndex(item => item.add_on_service_id === itemId);
        if (index === -1) {
            // เพิ่มรายการที่เลือก
            this.selectedItems.push({ add_on_service_id: itemId, add_on_service_price: itemPrice });
        } else {
            // ลบรายการที่เลือก
            this.selectedItems.splice(index, 1);
        }
    }

    isSelected(itemId: number): boolean {
        return this.selectedItems.some(item => item.add_on_service_id === itemId);
    }

    get getSelectedItems(): { add_on_service_id: number, add_on_service_price: number }[] {
        return this.selectedItems;
    }

    Submit() {
        if (this.form.invalid) {
            return
        }

        const formValue = {
            ...this.form.value,
            add_on_services: this.getSelectedItems,
        }

        const confirmation = this.fuseConfirmationService.open({
            title: "ยืนยันการบันทึกข้อมูล",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "primary"
            },
            actions: {
                confirm: {
                    show: true,
                    label: "ยืนยัน",
                    color: "primary"
                },
                cancel: {
                    show: true,
                    label: "ยกเลิก"
                }
            },
            dismissible: false
        })

        confirmation.afterClosed().subscribe(
            result => {
                // if (result == 'confirmed') {
                //     if (this.data.type === 'NEW') {
                //         this._service.create(formValue).subscribe({
                //             error: (err) => {
                //                 this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                //             },
                //             complete: () => {
                //                 this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                //                 this.dialogRef.close(true)
                //             },
                //         });
                //     } else {
                //         this._service.update(this.data.value.id, formValue).subscribe({
                //             error: (err) => {
                //                 this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                //             },
                //             complete: () => {
                //                 this.toastr.success('ดำเนินการแก้ไขข้อมูลสำเร็จ')
                //                 this.dialogRef.close(true)
                //             },
                //         });
                //     }
                // }
            }
        )
    }

    onClose() {
        this.dialogRef.close()
    }

    addToCart() {
        if (this.form.invalid) {
            return
        }

        const body = {
            ...this.form.value,
            add_on_services: this.getSelectedItems,
            options: this.options,
        }

        this.dialogRef.close(body)
    }

    onSelectChange(event: any, index: number) {
        const selectedValue = event.target.value;
        this.options[index].option_name = selectedValue
    }

    increaseQuantity() {
        let qty = this.form.value.product_qty; // ดึงค่าปัจจุบัน
        qty++; // เพิ่มค่า

        this.form.patchValue({
            product_qty: qty
        });
    }

    decreaseQuantity() {
        let qty = this.form.value.product_qty; // ดึงค่าปัจจุบัน
        if (qty > 1) {
            qty--; // ลดค่าเมื่อมากกว่า 1
            this.form.patchValue({
                product_qty: qty
            });
        }
    }

}
