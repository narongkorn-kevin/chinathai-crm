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
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { OrderProductsService } from '../../order-products/order-products.service';
import { uniq } from 'lodash';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'app-dialog-form-order-fee',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        NgxMaskDirective,
    ],
    providers: [
        provideNgxMask()
    ]
})
export class DialogOrderFeeComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    fee: any;
    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogOrderFeeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private orderProductService: OrderProductsService
    ) { }

    ngOnInit(): void {
        // Initialize form synchronously to avoid undefined FormGroup in template
        const orderLists = this.data?.orderLists?.order_lists || [];

        this.form = this.FormBuilder.group({
            china_shipping_fee: [this.data?.orderLists?.china_shipping_fee ?? null, Validators.required],
            deposit_fee: [
                this.data?.orderLists?.deposit_fee != null ? +this.data.orderLists.deposit_fee : null,
                Validators.required,
            ],
            exchange_rate: [null, Validators.required],
            order_lists: this.FormBuilder.array(
                orderLists.map((item: any) => {
                    return this.FormBuilder.group({
                        order_list_id: [item.order_list_id],
                        product_real_price: [item.product_real_price],
                        product_shop: [item.product_shop],
                        product_real_link: [item?.product_real_link],
                        qty: [item?.qty],
                        product_negotiated_price: [item?.product_negotiated_price],
                    });
                })
            ),
            total_price: [0],
        });

        // Fetch fee and patch the exchange rate (and EDIT data) after form exists
        this.orderProductService.getfee().subscribe((res: any) => {
            this.fee = res?.rate;
            this.form.patchValue({
                exchange_rate: +res?.rate || 0,
            });

            if (this.data?.type === 'EDIT') {
                this.form.patchValue({
                    ...this.data.value,
                });
            }
        });
    }

    Submit() {
        console.log(this.form.value , 'form.value');
        
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        const shopCount = uniq(this.form.value.order_lists.map(e => e.product_shop)).length;

        const total = this.form.value.order_lists.reduce((acc, curr) => {
            const price = +curr.product_real_price || 0;
            const qty = +curr.qty || 0;
            return acc + ((price * qty) * this.form.value.exchange_rate);
        }, 0);

        const shipping = this.form.value.china_shipping_fee * this.form.value.exchange_rate;

        const formValue = {
            ...this.form.value,
            total_price: (total + shipping) + (this.form.value.deposit_fee * shopCount),
        };

        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.save_title'),
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.confirm_button'
                    ),
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.cancel_button'
                    ),
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this.orderProductService.updateFee(formValue, this.data.orderId).subscribe({
                    error: (err) => {
                        this.toastr.error('ไม่สามารถบันทึกข้อมูลได้')
                    },
                    complete: () => {
                        this.toastr.success('ดำเนินการเพิ่มข้อมูลสำเร็จ')
                        this.dialogRef.close(true)
                    },
                });
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
