import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ShiftService } from './shift.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-shift-promotion',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
    ],
    templateUrl: './shift.component.html',
    styleUrl: './shift.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe],
})
export class ShiftComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private _service: ShiftService,
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
                    title: 'ลำดับ',
                    data: 'no',
                    className: 'w-15 text-center'
                },
                {
                    title: 'วันที่',
                    data: 'createdAt',
                    // className: 'w-30',
                    ngPipeInstance: this.datePipe,
                    ngPipeArgs: ['dd-MM-yyyy HH:mm:ss'],
                    className: 'text-center'
                },
                {
                    title: 'สถานะ',
                    data: 'status',
                    render:(data: any) => {
                        if(data == 'open')
                            return 'เปิดกะ'
                        else if(data == 'close')
                            return 'ปิดกะ'
                        else
                            return data
                    },
                    className: 'text-center'
                },
                {
                    title: 'change',
                    data: 'change',
                    className: 'text-center'
                },
                {
                    title: 'cash',
                    data: 'cash',
                    className: 'text-center'
                },
                // {
                //     title: 'จัดการ',
                //     data: null,
                //     defaultContent: '',
                //     ngTemplateRef: {
                //         ref: this.btNg,
                //     },
                //     className: 'w-15'
                // }

            ]
        }
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
