import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BannerService } from './banner.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';
import { BannerComposeComponent } from './dialog/banner-compose/banner-compose.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-banner-banner',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
    ],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BannerComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    langues: any;
    languageUrl: any;
    @ViewChild('btNg') btNg: any;
    @ViewChild('btPicture') btPicture: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('textStatus') textStatus: any;
dataRow: any[]
    constructor(
        private translocoService: TranslocoService,
        private _service: BannerService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router
    ) { }
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
        const menuTitles = {
            bill_payment_service: {
                th: 'บริการฝากชำระ',
                en: 'Payment-on-behalf service',
                cn: '代付服务',
            },
            order_proxy_service: {
                th: 'บริการฝากสั่ง',
                en: 'Order-on-behalf service',
                cn: '代购服务',
            },
            alipay_topup_service: {
                th: 'บริการเติม Alipay',
                en: 'Alipay top-up service',
                cn: '支付宝充值服务',
            },
            edited_by: {
                th: 'ผู้แก้ไข',
                en: 'Edited by',
                cn: '编辑人',
            },
            date: {
                th: 'วันที่แก้ไข',
                en: 'Change Date',
                cn: '日期',
            },


        };
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: false,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                this._service
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data,
                            });
                        },
                    });
            },
            columns: [
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },

                {
                    title: menuTitles.bill_payment_service[this.langues],
                    data: 'product_payment_rate',
                    className: 'text-center',
                },
                {
                    title: menuTitles.order_proxy_service[this.langues],
                    data: 'deposit_order_rate',
                    className: 'text-center',
                },
                {
                    title: menuTitles.alipay_topup_service[this.langues],
                    data: 'alipay_topup_rate',
                    className: 'text-center',
                },


                {
                    title: menuTitles.edited_by[this.langues],
                    data: 'create_by',
                    className: 'text-center',
                },
                {
                    title: menuTitles.date[this.langues],
                    data: function (row: any) {
                        const createdAt = row.created_at
                            ? row.created_at
                            : null;

                        return createdAt
                            ? DateTime.fromISO(createdAt, { zone: 'utc' }).toLocal().toFormat('dd/MM/yyyy HH:mm')
                            : '-';
                    },
                    className: 'text-center',
                },
            ],
            // Declare the use of the extension in the dom parameter
            dom: 'lfrtip',
            buttons: [
                {
                    extend: 'copy',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'csv',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'excel',
                    className: 'btn-csv-hidden'
                },
                {
                    extend: 'print',
                    className: 'btn-csv-hidden'
                },
            ]
        };
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    openDialogEdit(item: any) {
        console.log(item);
        this._service.get(item).subscribe((resp: any) => {
            const DialogRef = this.dialog.open(BannerComposeComponent, {
                disableClose: true,
                // Responsive dialog sizing
                width: '95vw',
                maxWidth: '600px',
                height: 'auto',
                maxHeight: '90vh',
                data: {
                    type: 'EDIT',
                    value: resp,
                },
                // panelClass: 'overflow-auto'
            });
            DialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    console.log(result, 'result');
                    this.rerender();
                }
            });
        });
    }

    clickDelete(id: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.delete_title'),
            message: this.translocoService.translate(
                'confirmation.delete_message'
            ),
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.confirm_button'
                    ),
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: this.translocoService.translate(
                        'confirmation.cancel_button'
                    ),
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this._service.delete(id).subscribe({
                    error: (err) => { },
                    complete: () => {
                        this.toastr.success(
                            this.translocoService.translate(
                                'toastr.del_successfully'
                            )
                        );
                        this.rerender();
                    },
                });
            }
        });
    }
    showPicture(imgObject: string): void {

        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
    createBanner() {
        const DialogRef = this.dialog.open(BannerComposeComponent, {
            disableClose: true,
            width: '95vw',
            maxWidth: '600px',
            height: 'auto',
            maxHeight: '90vh',
            // enterAnimationDuration: 300,
            // exitAnimationDuration: 300,
            data: {
                type: 'NEW',
            },
            // panelClass: 'overflow-auto'
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }
}
