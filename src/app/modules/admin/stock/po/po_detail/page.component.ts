import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
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
import { PoService } from '../po.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { BarcodeComponent } from "./barcode/page.component";
import { DetailComponent } from "./detail/page.component";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-stock-po-detail',
    standalone: true,
    imports: [
    CommonModule,
    DataTablesModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    BarcodeComponent,
    DetailComponent
],
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe],
})
export class PoDetailComponent implements OnInit, AfterViewInit, OnDestroy {
    dtOptions_1: any = {};
    dtTrigger_1: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptions_2: any = {};
    dtTrigger_2: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptions_3: any = {};
    dtTrigger_3: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
    selectedTab: string = 'รายละเอียดใบรับเข้าคลัง/PO';
    receiptNumber: string = '';

    constructor(
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _service: PoService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.http.get<any>('assets/data/po.json').subscribe(data => {
            console.log(data); // ตรวจสอบข้อมูลใน Console
            this.receiptNumber = data.receipt;
        });
    }

    ngAfterViewInit(): void {
        // setTimeout(() => {
        //     this.dtTrigger_1.next(this.dtOptions_1);
        //     this.dtTrigger_2.next(this.dtOptions_2);
        //     this.dtTrigger_3.next(this.dtOptions_3);
        // }, 200);
    }

    ngOnDestroy(): void {
        // this.dtTrigger_1.unsubscribe();
        // this.dtTrigger_2.unsubscribe();
        // this.dtTrigger_3.unsubscribe();
    }

    loadTable1(): void {
        this.dtOptions_1 = {
            pagingType: 'full_numbers',
            serverSide: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._service.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        callback({
                            recordsTotal: resp.meta.totalItems,
                            recordsFiltered: resp.meta.totalItems,
                            data: resp.data
                        });
                    }
                })
            },
            columns: [
                {
                    title: '#',
                    data: 'no',
                    className: 'w-15 text-center'
                },
                {
                    title: 'วันที่เข้าโกดัง',
                    data: 'createdAt',
                    ngPipeInstance: this.datePipe,
                    ngPipeArgs: ['yyyy-MM-dd'],
                    className: 'text-center'
                },
                {
                    title: 'ใบรับเข้าคลัง',
                    data: 'change',
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<a href="/po-detail" class="text-[#DF0B12] hover:font-bold">${data}</a>`;
                    }
                }
            ]
        };
    }

    loadTable2(): void {
        this.dtOptions_2 = {
            pagingType: 'full_numbers',
            serverSide: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._service.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        callback({
                            recordsTotal: resp.meta.totalItems,
                            recordsFiltered: resp.meta.totalItems,
                            data: resp.data
                        });
                    }
                });
            },
            columns: [
                {
                    title: 'รูปสินค้า',
                    data: 'no',
                    className: 'w-15 text-center'
                },
                {
                    title: 'ประเภท',
                    data: 'change',
                    className: 'text-center'
                },
                {
                    title: 'ชื่อผลิตภัณฑ์',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'รูปแบบบรรจุภัณฑ์',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'โลโก้',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'จำนวนลัง',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'จำนวนชิ้น',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'น้ำหนัก',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'CBM',
                    data: 'cash',
                    className: 'text-center'
                }
            ]
        };
    }

    loadTable3(): void {
        this.dtOptions_3 = {
            pagingType: 'full_numbers',
            serverSide: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._service.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        console.log('Data loaded for Barcode tab:', resp); // Debugging data loading
                        callback({
                            recordsTotal: resp.meta.totalItems,
                            recordsFiltered: resp.meta.totalItems,
                            data: resp.data
                        });
                    }
                });
            },
            columns: [
                {
                    title: '#',
                    data: 'no',
                    className: 'w-15 text-center'
                },
                {
                    title: 'Tracking',
                    data: 'change',
                    className: 'text-center'
                },
                {
                    title: 'Cargo in',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'Cargo out',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'Cargo Thai',
                    data: 'cash',
                    className: 'text-center'
                },
                {
                    title: 'Status',
                    data: 'cash',
                    className: 'text-center'
                }
            ]
        };
    }

    backToPo(): void {
        this._router.navigate(['/po']);
    }

    goToPoEdit(): void {
        this._router.navigate(['/po-edit']);
    }

    // rerender(): void {
    //     if (this.dtElement && this.dtElement.dtInstance) {
    //         this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //             dtInstance.destroy();
    //             console.log('Destroyed existing DataTable instance'); // Debugging DataTable destruction
    //             if (this.selectedTab === 'รายละเอียดใบรับเข้าคลัง/PO') {
    //                 console.log('Initializing DataTables 1 and 2'); // Debugging DataTable reinitialization
    //                 this.dtTrigger_1.next(this.dtOptions_1);
    //                 this.dtTrigger_2.next(this.dtOptions_2);
    //             } else if (this.selectedTab === 'Barcode') {
    //                 console.log('Initializing DataTable 3'); // Debugging DataTable reinitialization
    //                 this.dtTrigger_3.next(this.dtOptions_3);
    //             }
    //         });
    //     }
    // }
}
