import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { ClientRewardService } from './client-reward.service';
import { ClientRewardStatusDialogComponent } from './status-dialog/client-reward-status-dialog.component';

@Component({
    selector: 'app-client-reward',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    templateUrl: './client-reward.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientRewardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('memberTemplate') memberTemplate: any;
    @ViewChild('rewardTemplate') rewardTemplate: any;
    @ViewChild('statusTemplate') statusTemplate: any;
    @ViewChild('dateTemplate') dateTemplate: any;
    @ViewChild('actionTemplate') actionTemplate: any;

    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    filterForm: FormGroup;

    private _destroy$ = new Subject<void>();

    languageUrl: string;

    statusOptions = [
        { value: '', label: 'ทั้งหมด' },
        { value: 'pending', label: 'รอดำเนินการ' },
        { value: 'approved', label: 'อนุมัติแล้ว' },
        { value: 'processing', label: 'กำลังดำเนินการ' },
        { value: 'shipped', label: 'จัดส่งแล้ว' },
        { value: 'completed', label: 'เสร็จสิ้น' },
        { value: 'rejected', label: 'ถูกปฏิเสธ' },
        { value: 'canceled', label: 'ยกเลิก' },
        { value: 'expired', label: 'หมดอายุ' },
    ];

    statusLabelMap: Record<string, string> = {
        pending: 'รอดำเนินการ',
        approved: 'อนุมัติแล้ว',
        processing: 'กำลังดำเนินการ',
        shipped: 'จัดส่งแล้ว',
        completed: 'เสร็จสิ้น',
        rejected: 'ถูกปฏิเสธ',
        canceled: 'ยกเลิก',
        expired: 'หมดอายุ',
    };

    statusClassMap: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700 border border-amber-200',
        approved: 'bg-blue-100 text-blue-700 border border-blue-200',
        processing: 'bg-sky-100 text-sky-700 border border-sky-200',
        shipped: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
        completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        rejected: 'bg-red-100 text-red-600 border border-red-200',
        canceled: 'bg-rose-100 text-rose-600 border border-rose-200',
        expired: 'bg-gray-200 text-gray-600 border border-gray-300',
    };

    constructor(
        private _fb: FormBuilder,
        private _service: ClientRewardService,
        private _dialog: MatDialog,
        private _toastr: ToastrService,
    ) {
        this.filterForm = this._fb.group({
            search: [''],
            status: [''],
        });
    }

    ngOnInit(): void {
        const lang = localStorage.getItem('lang');
        if (lang === 'en') {
            this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (lang === 'cn') {
            this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }

        this.filterForm.valueChanges
            .pipe(debounceTime(400), takeUntil(this._destroy$))
            .subscribe(() => this.rerender());
    }

    ngAfterViewInit(): void {
        this._configureTable();
        setTimeout(() => this.dtTrigger.next(this.dtOptions));
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
        this._destroy$.next();
        this._destroy$.complete();
    }

    applyFilters(): void {
        this.rerender();
    }

    resetFilters(): void {
        this.filterForm.reset({ search: '', status: '' });
        this.rerender();
    }

    _configureTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            processing: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                const filterValues = this.filterForm.value;
                const payload = {
                    ...dataTablesParameters,
                    search: filterValues.search,
                    status: filterValues.status,
                };

                this._service.datatable(payload).subscribe({
                    next: (resp: any) => {
                        const summary = resp?.data ?? {};
                        callback({
                            recordsTotal: summary.total ?? 0,
                            recordsFiltered: summary.total ?? 0,
                            data: summary.data ?? [],
                        });
                    },
                    error: () => {
                        this._toastr.error('ไม่สามารถโหลดข้อมูลได้');
                        callback({
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: [],
                        });
                    },
                });
            },
            columns: [
                {
                    title: '#',
                    data: 'No',
                    className: 'text-center w-12',
                    orderable: false,
                },
                {
                    title: 'ลูกค้า',
                    data: null,
                    className: 'text-left',
                    orderable: false,
                    ngTemplateRef: { ref: this.memberTemplate },
                },
                {
                    title: 'ของรางวัล',
                    data: null,
                    className: 'text-left',
                    orderable: false,
                    ngTemplateRef: { ref: this.rewardTemplate },
                },
                {
                    title: 'จำนวน',
                    data: 'qty',
                    className: 'text-center w-16',
                },
                {
                    title: 'สถานะ',
                    data: null,
                    className: 'text-center',
                    orderable: false,
                    ngTemplateRef: { ref: this.statusTemplate },
                },
                {
                    title: 'อัปเดตล่าสุด',
                    data: 'updated_at',
                    className: 'text-center',
                    ngTemplateRef: { ref: this.dateTemplate },
                },
                {
                    title: 'จัดการ',
                    data: null,
                    className: 'text-center w-16',
                    orderable: false,
                    ngTemplateRef: { ref: this.actionTemplate },
                },
            ],
        };
    }

    rerender(): void {
        if (!this.dtElement) {
            return;
        }

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(this.dtOptions);
        });
    }

    displayStatus(status: string): string {
        return this.statusLabelMap[status] ?? status;
    }

    statusClass(status: string): string {
        return this.statusClassMap[status] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
    }

    openStatusDialog(row: any): void {
        const dialogRef = this._dialog.open(ClientRewardStatusDialogComponent, {
            width: '360px',
            data: {
                reward: row,
                statusOptions: this.statusOptions.filter((option) => option.value !== ''),
            },
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe((updated) => {
            if (updated) {
                this.rerender();
            }
        });
    }
}
