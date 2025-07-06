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
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { OrderProductsService } from '../../order-products/order-products.service';
@Component({
    selector: 'app-dialog-form-update-status-order',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
        FormsModule, MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule
    ]
})
export class DialogUpdateDeliveryComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    status: any[] = [
        {
            value: 'wait_payment',
            name: 'รอชำระคำสั่งซื้อ',

        },
        {
            value: 'saled',
            name: 'สั่งซื้อเรียบร้อย',
        },
    ]
    constructor(
        private dialogRef: MatDialogRef<DialogUpdateDeliveryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private service: OrderProductsService
    ) {

    }

    ngOnInit(): void {
        this.form = this.FormBuilder.group({
            order_list_id: this.data.order_list_id,
            track_ecommerce_no: ['', Validators.required],
        });
    }

    Submit() {
        if (this.form.invalid) {
            return
        }

        const formValue = {
            ...this.form.value
        }

        console.log(formValue);

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
                if (result == 'confirmed') {
                    this.service.updateupdateTrackNo(formValue)
                        .subscribe({
                            next: (resp: any) => {
                                this.toastr.success('แก้ไขรายการ สำเร็จ')
                                this.dialogRef.close();
                            },
                            error: (err: any) => {
                                this.toastr.error('แก้ไขรายการ ไม่สำเร็จ')
                            }
                        })
                }
            }
        )
    }



    onClose() {
        this.dialogRef.close()
    }

}
