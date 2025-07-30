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
    Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { DialogService } from './dialog.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-dialog-form-update-status-order',
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
        TranslocoModule,
    ],
})
export class DialogUpdateStatusComponent implements OnInit {
    user: any;
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    status: any[] = [];
    availableStatus: any[] = [];
    isAdmin: boolean = false;

    // Define the status order for sequential progression
    statusOrder: string[] = [
        'awaiting_summary',
        'awaiting_payment',
        'in_progress',
        'preparing_shipment',
        'shipped',
        'cancelled',
    ];

    constructor(
        private dialogRef: MatDialogRef<DialogUpdateStatusComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { orders: any[]; status: any[]; service: any },
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private service: DialogService,
        private translocoService: TranslocoService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
        this.user = JSON.parse(localStorage.getItem('user'));
        this.isAdmin = this.user?.permission?.name === 'admin';
        this.status = data.status;
    }
    langues: any;
    lang: string;
    languageUrl: any;

    ngOnInit(): void {
        if (this.langues === 'en') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (this.langues === 'cn') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }
        this.form = this.FormBuilder.group({
            status: [this.data.orders.length == 1 ? this.data.orders[0].status : '', Validators.required],
        });
        this.setupAvailableStatusOptions();
    }

    setupAvailableStatusOptions(): void {
        if (this.isAdmin) {
            // Admin can see all status options
            this.availableStatus = [...this.status];
        } else if (this.data.orders.length == 1) {
            // Regular users can only see the next status in sequence
            const currentStatus = this.data.orders[0].status;
            const currentIndex = this.statusOrder.indexOf(currentStatus);

            if (
                currentIndex !== -1 &&
                currentIndex < this.statusOrder.length - 1
            ) {
                // Find the next status in the sequence
                const nextStatusValue = this.statusOrder[currentIndex + 1];
                const nextStatus = this.status.find(
                    (s) => s.value === nextStatusValue
                );

                if (nextStatus) {
                    this.availableStatus = [
                        // Include current status
                        this.status.find((s) => s.value === currentStatus),
                        // And next status
                        nextStatus,
                    ];
                } else {
                    // If next status not found, just show current
                    this.availableStatus = [
                        this.status.find((s) => s.value === currentStatus),
                    ];
                }
            } else {
                // If at the end of the sequence or status not found, just show current
                this.availableStatus = [
                    this.status.find((s) => s.value === currentStatus),
                ];
            }
        }
    }

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }

        const tabletitles = {
            confirm: { th: 'ยืนยัน', en: 'Confirm', cn: '确认' },
            cancel: { th: 'ยกเลิก', en: 'Cancel', cn: '取消' },
            title: {
                th: 'ยืนยันการบันทึกข้อมูล',
                en: 'Confirm data',
                cn: '确认数据',
            },
            confire: {
                th: 'ดำเนินการล้มเหลว',
                en: 'Operation failed',
                cn: '操作失敗',
            },
            susses: {
                th: 'ดำเนินการสำเร็จ',
                en: 'Completed successfully',
                cn: '成功完成',
            },
        };

        const confirmation = this.fuseConfirmationService.open({
            title: tabletitles.title[this.langues],
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: tabletitles.confirm[this.langues],
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: tabletitles.cancel[this.langues],
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                console.log(this.data.orders);
                
                const body = {
                    ...this.form.value,
                    orders: [this.data.orders[0].id],
                };
                if (this.data.service == 'import-product-order') {
                    this.service
                        .updateImportProductOrderStatus(body)
                        .subscribe({
                            error: (err) => {
                                this.toastr.error(
                                    tabletitles.confire[this.langues]
                                );
                            },
                            complete: () => {
                                this.toastr.success(
                                    tabletitles.susses[this.langues]
                                );
                                this.dialogRef.close(true);
                            },
                        });
                } else {
                    this.service.updateOrderProductStatus(body).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                tabletitles.confire[this.langues]
                            );
                        },
                        complete: () => {
                            this.toastr.success(
                                tabletitles.susses[this.langues]
                            );
                            this.dialogRef.close(true);
                        },
                    });
                }
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    get orderCode() {
        return this.data.orders.map((e) => e.code).join(', ');
    }
}
