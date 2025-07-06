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
import { DialogService } from './dialog.service';

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
export class DialogUpdateStatusComponent implements OnInit {
    order_no: string
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;

    status: any[] = []

    constructor(
        private dialogRef: MatDialogRef<DialogUpdateStatusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { orders: any[], status: any[], service: any },
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private service: DialogService,
    ) {
        this.order_no = data.orders.map(e => e.code).join(',');
        this.status = data.status;
    }

    ngOnInit(): void {
        this.form = this.FormBuilder.group({
            status: ['', Validators.required]
        });
    }

    Submit() {
        if (this.form.invalid) {
            return
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
                if (result == 'confirmed') {
                    const body = {
                        ...this.form.value,
                        orders: this.data.orders.map(e => e.id)
                    }

                    if (this.data.service == 'import-product-order') {
                        this.service.updateImportProductOrderStatus(body).subscribe({
                            error: (err) => {
                                this.toastr.error('ดำเนินการล้มเหลว')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        })
                    } else {
                        this.service.updateOrderProductStatus(body).subscribe({
                            error: (err) => {
                                this.toastr.error('ดำเนินการล้มเหลว')
                            },
                            complete: () => {
                                this.toastr.success('ดำเนินการสำเร็จ')
                                this.dialogRef.close(true)
                            },
                        })
                    }
                }
            }
        )
    }

    onClose() {
        this.dialogRef.close()
    }

}
