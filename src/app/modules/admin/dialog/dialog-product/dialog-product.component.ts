import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogClose,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
    selector: 'app-dialog-product',
    standalone: true,
    templateUrl: './dialog-product.component.html',
    styleUrl: './dialog-product.component.scss',
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
export class DialogProductComponent implements OnInit {

    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;

    product: any;
    addOnServices: any[] = [];
    options: { option_name: string, option_image: string, option_note: string }[] = [];

    selectedItems: { add_on_service_id: number, add_on_service_price: number }[] = [];

    props: any[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogProductComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
    ) {
        this.product = data.product.item
        this.addOnServices = data.addOnServices

        const props_list: string[] = Object.values(this.product.props_list)

        const group = {}
        for (const prop of props_list) {
            const _prop = prop.split(':');

            if (_prop.length < 2) continue; // ข้ามถ้าไม่มีค่าหลัง ":"

            const key = _prop[0];
            const value = _prop.slice(1).join(':'); // รองรับค่าที่มี ":" มากกว่าหนึ่ง

            if (!group[key]) {
                group[key] = [value];
            } else {
                group[key].push(value);
            }
        }

        this.props = Object.entries(group).map(([name, list]) => ({ name, list }));

        for (const prop of this.props) {
            this.options.push({
                option_name: prop.list[0],
                option_image: "",
                option_note: ""
            })
        }
    }

    ngOnInit(): void {
        this.form = this.FormBuilder.group({
            product_code: [this.product.num_iid],
            product_name: [this.product.title],
            product_url: [this.product.detail_url],
            product_image: [this.product.pic_url],
            product_category: [''],
            product_store_type: [this.product.productStoreType],
            product_note: [''],
            product_price: [this.product.price],
            product_qty: [1],
        });
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
            ...this.form.value
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
