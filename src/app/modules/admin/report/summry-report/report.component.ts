import { CommonModule, CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from '../page.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderStatusPipe } from 'app/modules/common/order-status.pipe';
import { Router } from '@angular/router';
import { DialogForm } from './form-dialog/dialog.component';
import { SearchComponent } from 'app/modules/common/search-component/search.component';
import { DateTime } from 'luxon';
import localeTh from '@angular/common/locales/th';
import { createFileFromBlob } from 'app/helper';

registerLocaleData(localeTh);

@Component({
    selector: 'app-page-unit',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        MatDatepickerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        SearchComponent
    ],
    providers: [
        OrderStatusPipe,
        CurrencyPipe,
        DatePipe,
        { provide: LOCALE_ID, useValue: 'th-TH' }
    ],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ReportComponent implements OnInit, AfterViewInit {

    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    form: FormGroup
    exportForm: FormGroup
    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('searchComponent') searchComponent: SearchComponent;
    constructor(
        private _service: ReportService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private orderStatus: OrderStatusPipe,
        private currencyPipe: CurrencyPipe,
        private datePipe: DatePipe,
        private _router: Router

    ) {
        this.form = this._fb.group({
            orderDate: '',
            branchId: '',
            orderStatus: '',
        })
        this.exportForm = this._fb.group({
            startDate: '',
            endDate: '',
        })
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
                dataTablesParameters.filter = {
                    'filter.orderDate': this.form.value.orderDate ?? '',
                    'filter.shift.branch.id': this.form.value.branchId ?? '',
                    'filter.orderStatus': this.form.value.orderStatus ?? ''
                }
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
                    title: 'วันที่ทำรายการ',
                    data: 'orderDate',
                    
                    // ngPipeInstance: this.datePipe,
                    // ngPipeArgs: ['mediumDate'],
                    className: 'text-center',
                    render: function (data, type, row) {
                        return DateTime.fromISO(data).toFormat('dd/MM/yyyy HH:mm:ss');
                      }
                },

                {
                    title: 'เลขที่ทำรายการ',
                    data: 'orderNo',
                    className: 'text-center'
                },
                {
                    title: 'ส่วนลด',
                    data: 'discount',
                    ngPipeInstance: this.currencyPipe,
                    ngPipeArgs: ['THB'],
                    className: 'text-center'
                },
                {
                    title: 'ยอดรวม',
                    data: 'total',
                    ngPipeInstance: this.currencyPipe,
                    ngPipeArgs: ['THB'],
                    className: 'text-center'
                },
                {
                    title: 'ยอดรวมสุทธิ',
                    data: 'grandTotal',
                    ngPipeInstance: this.currencyPipe,
                    ngPipeArgs: ['THB'],
                    className: 'text-center'
                },
                {
                    title: 'สถานะ',
                    data: 'orderStatus',
                    ngPipeInstance: this.orderStatus,
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

    printBill(item: any) {
        const url = '/report/print/' + item;
        window.open(url, '_blank');
    }

    openDialogSearch() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: '90%',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW'
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')

            }
        });
    }

    handleChange(updateData: any): void {
        var betweenString = ''
        if (updateData.startDate && updateData.endDate) {
            var startDate = DateTime.fromISO(updateData.startDate).toFormat('yyyy-MM-dd');
            var endDate = DateTime.fromISO(updateData.endDate).toFormat('yyyy-MM-dd');
            betweenString = `$btw:${startDate},${endDate}`;
        }

        this.form.patchValue({
            orderStatus: updateData.status ?? '',
            orderDate: betweenString ?? '',
            branchId: updateData.branchId ?? ''
        })

        this.exportForm.patchValue({
            startDate: startDate,
            endDate: endDate
        })

        console.log(this.form.value)
    }

    onSearch() {
        this.rerender()
    }

    exportExcel() {
        this._service.exportExcelTotal('').subscribe({
            next: (resp) => {
              createFileFromBlob(resp)
            },
            error: (err) => {
                console.error(err)
                alert(JSON.stringify(err.statusText))
            }
            })
        }

    resetSearch() {
        this.form.reset();
        this.exportForm.reset();
        this.searchComponent.reset();
        this.rerender()
    }
}


