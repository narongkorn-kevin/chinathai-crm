import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
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
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReportListService } from '../report-list.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { DateTime } from 'luxon';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
    selector: 'app-device-form-17',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [CommonModule, DataTablesModule, MatIconModule, MatFormFieldModule, MatInputModule,
        FormsModule, MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDatepickerModule
    ]
})
export class DialogForm implements OnInit {

    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    addForm: FormGroup;
    walletTypeData: any[] = [];
    cardTypeData: any[] = [];
    constructor(
        private dialogRef: MatDialogRef<DialogForm>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        public _service: ReportListService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
    ) {
        this.form = this.FormBuilder.group({
            date: '',
            startDate: '',
            endDate: '',
            categoryId: '',
            branchId: '',
            walletType: '',
            cardType: '',
        });
    }

    ngOnInit(): void {
       this.walletTypeData =  [
        {
            key: 'WAL',
            name: 'EL1 Personal Wallet'
        },
        {
            key: 'EL2',
            name: 'EL2 OT Credit'
        },
        {
            key: 'EL4',
            name: 'EL4 VIP Credit'
        },
    ];
    this.cardTypeData = [
        'A', 'B'
    ]
    }

    Submit() {
        if (this.data.value.code === 'remainCreditDaily') {
            this.remainCreditDaily()
        } else if (this.data.value.code === 'paymentTopup') {
            this.paymentTopup()
        } else if (this.data.value.code === 'tapLogSummaryShift') {
            this.tapLogSummaryShift()
        } else if (this.data.value.code === 'tapLogSummaryMember') {
            this.tapLogSummaryMember()
        } else if (this.data.value.code === 'tapLogReportToday') {
            this.tapLogReportToday()
        } else if (this.data.value.code === 'paymentMethodHistory') {
            this.paymentMethodHistory()
        } else if (this.data.value.code === 'summaryPaidCard') {
            this.summaryPaidCard()
        } else if (this.data.value.code === 'cashierOutlet') {
            this.cashierOutlet()
        } else if (this.data.value.code === 'cardMovementDetail') {
            this.cardMovementDetail()
        } else if (this.data.value.code === 'tapLogSummaryDetail') {
            this.tapSummaryDetail()
        }
        return;
    }

    onClose() {
        this.dialogRef.close()
    }

    remainCreditDaily() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }



        this._service.remainCreditDaialy({ startDate: startDate, endDate: endDate }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }

    paymentTopup() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }



        this._service.paymentTopup({ startDate: startDate, endDate: endDate, walType: formValue.walletType }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }

    tapLogSummaryShift() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }

        if (!formValue.cardType) {
            this.toastr.error('กรุณาเลือกประเภทบัตร')
            return;
        }

        this._service.tapSummaryShift({ startDate: startDate, endDate: endDate, cardType: formValue.cardType }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }
    tapLogSummaryMember() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }

        if (!formValue.cardType) {
            this.toastr.error('กรุณาเลือกประเภทบัตร')
            return;
        }

        this._service.tapSummaryMember({ startDate: startDate, endDate: endDate, cardType: formValue.cardType, memberId: 0 }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `summary_${startDate}_${endDate}.xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }

    tapLogReportToday() {
        let formValue = this.form.value
        var date = DateTime.fromISO(formValue.date).toFormat('yyyy-MM-dd');
        if (!formValue.date) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }

        this._service.tapLogToday({ date: date}).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `report_tap_log_today${date}.xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }

    paymentMethodHistory() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }

        this._service.paymentMethodHistory({ startDate: startDate, endDate: endDate }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `POS_LogCardPayment_Sum_${startDate}_${endDate}..xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }
    summaryPaidCard() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }


        if (!formValue.walletType) {
            this.toastr.error('กรุณาเลือกประเภทกระเป๋า')
            return;
        }

        this._service.summaryPaidCard({ startDate: startDate, endDate: endDate, walleType: formValue.walletType }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `POS_RepTopup_Balance_Site${startDate}_${endDate}..xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }
    cashierOutlet() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }

        this._service.cashierOutlet({ startDate: startDate, endDate: endDate }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `POS_RepCashierOutlet_Sum_Essilor_${startDate}_${endDate}..xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }
    cardMovementDetail() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }

        this._service.cardMovementDetail({ startDate: startDate, endDate: endDate, memberId: 0 }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `POS_CardMomentDetail_Sum_Essilor_${startDate}_${endDate}..xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }
    tapSummaryDetail() {
        let formValue = this.form.value
        if (formValue.startDate && formValue.startDate) {
            var startDate = DateTime.fromISO(formValue.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(formValue.endDate).toFormat('yyyy-MM-dd');
        }

        if (!startDate || !endDate) {
            this.toastr.error('กรุณาเลือกวันที่')
            return;
        }

        this._service.tapSummaryDetail({ startDate: startDate, endDate: endDate, memberId: 0 }).subscribe({
            next: (resp) => {
                this.toastr.success('ดำเนินการสำเร็จ')
                createFileFromBlob(resp, `POS_TapLogCardDetail_Sum_Essilor_${startDate}_${endDate}..xlsx`);
            },
            error: (err) => {
                this.toastr.error('เกิดข้อผิดพลาด')
            }
        })
    }
}
