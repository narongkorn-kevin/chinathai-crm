import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { PoService } from './po.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-stock-po',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe],
})
export class PoComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    formField: string[] = ['fuse-mat-dense'];
    showAdvancedFilters: boolean = false;
    showFilters: boolean = true;



    constructor(
        private http: HttpClient,
        private _service: PoService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
    ) {

    }
    ngOnInit(): void {
        setTimeout(() =>
            this.loadTable());

    }

    toggleFilters() {
        this.showAdvancedFilters = !this.showAdvancedFilters;
        this.showFilters = !this.showFilters;
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
            serverSide: false,  // Set to false because we are loading client-side data
            ajax: (dataTablesParameters: any, callback) => {
                this.http.get('assets/data/po.json').subscribe({
                    next: (resp: any) => {
                        callback({
                            recordsTotal: resp.length,
                            recordsFiltered: resp.length,
                            data: resp
                        });
                    }
                });
            },
            columns: [
                {
                    title: '',
                    data: null,
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<input type="checkbox" class="form-checkbox" />`;
                    }
                },
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
                    data: 'receipt',
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<a href="/po-detail" class="text-[#DF0B12] hover:font-bold">${data}</a>`;
                    }
                },
                {
                    title: 'ลูกค้า',
                    data: 'customer',
                    className: 'text-center'
                },
                {
                    title: 'Shipment',
                    data: 'shipment',
                    className: 'text-center'
                },
                {
                    title: 'ขนส่งโดย',
                    data: 'delivery',
                    className: 'text-center'
                },
                {
                    title: 'ประเภท',
                    data: 'type',
                    className: 'text-center'
                },
                {
                    title: 'จำนวนลัง',
                    data: 'qty',
                    className: 'text-center'
                },
                {
                    title: 'น้ำหนัก',
                    data: 'weight',
                    className: 'text-center'
                },
                {
                    title: 'CBM',
                    data: 'cbm',
                    className: 'text-center'
                },
                {
                    title: 'ค่าใช้จ่าย',
                    data: 'pay',
                    className: 'text-center'
                },
                {
                    title: 'สถานะ',
                    data: 'status',
                    className: 'text-center'
                },
                {
                    title: 'Packinng Code',
                    data: 'packing',
                    className: 'text-center'
                },
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btNg,
                    },
                    className: 'text-center'
                },
            ],
            headerCallback: (thead, data, start, end, display) => {
                // Apply gray background to header
                $(thead).find('th').css('background-color', '#f2f2f2');
            }
        }
    }




    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(this.dtOptions);
        });
    }
}

