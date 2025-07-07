import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, Subject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SaleOrderService } from '../sale-order/sale-order.service';

@Component({
    selector: 'app-claim',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DataTablesModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule

    ],
    templateUrl: './claim.component.html'
})
export class ClaimComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    fromDate: string = '';
    toDate: string = '';
    customer: string = '';
    so: string = '';
    status: string = '';

    data = [
        {
            docNo: 'C1812110001',
            code: 'C6',
            created: '18-12-11 10:32',
            completed: '-',
            cancel: '19-04-10 15:14',
            product: 0.0,
            cncn: 0.0,
            cnth: 0.0,
            total: 118.83,
            status: 'Cancel'
        },
        {
            docNo: 'C1903190001',
            code: 'C5',
            created: '19-03-19 11:05',
            completed: '19-03-20 11:14',
            cancel: '-',
            product: 2896.8,
            cncn: 0.0,
            cnth: 0.0,
            total: 2896.8,
            status: 'Completed'
        },
        {
            docNo: 'C1903300001',
            code: 'TB33',
            created: '19-03-30 12:16',
            completed: '19-04-01 15:09',
            cancel: '-',
            product: 0.0,
            cncn: 0.0,
            cnth: 0.0,
            total: 102.0,
            status: 'Completed'
        },
        // ... เพิ่ม mock data ตามรูปต่อไปได้
    ];

    constructor(
        private _service: SaleOrderService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private activated: ActivatedRoute

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
            serverSide: true,     // Set the flag
            ajax: (dataTablesParameters: any, callback) => {
                this._service.datatable(dataTablesParameters)
                    .pipe(
                        map((resp: { data: any }) => resp.data)
                    )
                    .subscribe({
                        next: (resp: any) => {
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data
                            });
                        }
                    })
            },
            columns: [
                {
                    title: 'ลำดับ',
                    data: 'No',
                    className: 'w-15 text-center'
                },

                {
                    title: 'แผนก',
                    data: 'name',
                    className: 'text-center'
                },
                {
                    title: 'จัดการ',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btNg,
                    },
                    className: 'w-15 text-center'
                }

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
