import { CommonModule, DatePipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
// import { PoService } from './po.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { PalletService } from '../pallet.service';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-stock-pallet-edit',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe],
})
export class PalletEditComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _service: PalletService
    ) {}
    ngOnInit(): void {
        setTimeout(() => this.loadTable());
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._service.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        this.dtOptions.data = resp.data; // Store data for condition check
                        callback({
                            recordsTotal: resp.meta.totalItems,
                            recordsFiltered: resp.meta.totalItems,
                            data: resp.data,
                        });
                    },
                    error: () => {
                        this.dtOptions.data = []; // If an error occurs, ensure data is empty
                    },
                });
            },
            columns: [
                {
                    title: 'ลำดับ',
                    data: 'no',
                    className: 'w-15 text-center',
                },
                {
                    title: 'ลูกค้า',
                    data: 'change',
                    className: 'text-center',
                },
                {
                    title: 'เลขที่บาร์โค้ด',
                    data: 'cash',
                    className: 'text-center',
                },
                {
                    title: 'เลขที่ PO',
                    data: 'cash',
                    className: 'text-center',
                },
                {
                    title: 'ตรวจสอบจำนวน',
                    data: 'cash',
                    className: 'text-center',
                    render: (data, type, row) => {
                        let bgColor =
                            data === 'ครบ' ? 'bg-[#008000]' : 'bg-[#D02323]';
                        return `<span class="${bgColor} text-white p-2 rounded">${data}</span>`;
                    },
                },
                {
                    title: 'ขนส่งโดย',
                    data: 'cash',
                    className: 'text-center',
                },
                {
                    title: 'ประเภทพัสดุ',
                    data: 'cash',
                    className: 'text-center',
                },
                {
                    title: 'น้ำหนัก (Kg.)',
                    data: 'cash',
                    className: 'text-center',
                },
                {
                    title: 'CBM',
                    data: 'cash',
                    className: 'text-center',
                },
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btNg,
                    },
                    className: 'text-center',
                },
            ],
            headerCallback: (thead, data, start, end, display) => {
                // Apply gray background to header
                $(thead).find('th').css('background-color', '#f2f2f2');
            },
        };
    }

    openDialogProduct() {
        // เปิด dialog สำหรับการเพิ่มข้อมูลใหม่
        const DialogRef = this.dialog.open(ProductDialogComponent, {
            disableClose: true,
            width: '974px',
            height: 'auto',
            data: {
                type: 'ADD',
                value: {}, // ส่งข้อมูลว่างๆ สำหรับการเพิ่ม
            },
        });
    }

    backToPallet() {
        this._router.navigate(['/pallet']);
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }
}
