import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
    selector: 'app-stock-pallet-form',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe],
})
export class PalletFormComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        // private _service: PoService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
    ) {

    }
    ngOnInit(): void {
        // setTimeout(() =>
        //     this.loadTable());

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

    // loadTable(): void {
    //     this.dtOptions = {
    //         pagingType: 'full_numbers',
    //         serverSide: true,
    //         ajax: (dataTablesParameters: any, callback) => {
    //             this._service.datatable(dataTablesParameters).subscribe({
    //                 next: (resp: any) => {
    //                     callback({
    //                         recordsTotal: resp.meta.totalItems,
    //                         recordsFiltered: resp.meta.totalItems,
    //                         data: resp.data
    //                     });
    //                 }
    //             })
    //         },
    //         columns: [
    //             {
    //                 title: '#',
    //                 data: 'no',
    //                 className: 'w-15 text-center'
    //             },
    //             {
    //                 title: 'วันที่เข้าโกดัง',
    //                 data: 'createdAt',
    //                 ngPipeInstance: this.datePipe,
    //                 ngPipeArgs: ['yyyy-MM-dd'],
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'ใบรับเข้าคลัง',
    //                 data: 'change',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'ลูกค้า',
    //                 data: 'change',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'Shipment',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'ขนส่งโดย',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'ประเภท',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'จำนวนลัง',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'น้ำหนัก',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'CBM',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'ค่าใช้จ่าย',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'สถานะ',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: 'Packinng Code',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //             {
    //                 title: '',
    //                 data: 'cash',
    //                 className: 'text-center'
    //             },
    //         ]
    //     }
    // }

    backToPallet(){
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
