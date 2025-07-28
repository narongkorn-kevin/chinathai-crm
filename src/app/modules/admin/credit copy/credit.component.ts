import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CreditService } from './credit.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogForm } from './form-dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-credit',
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
    templateUrl: './credit.component.html',
    styleUrl: './credit.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CreditComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private translocoService: TranslocoService,
        private creditService: CreditService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog
    ) {
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    languageUrl: any;

    ngOnInit(): void {
        if (this.langues === 'en') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/en-gb.json';
        } else if (this.langues === 'th') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        } else if (this.langues === 'cn') {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh.json';
        } else {
            this.languageUrl =
                'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
        }
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
            sequence: {
                th: 'ลำดับ',
                en: 'No.',
                cn: '序号',
            },
            employee_code: {
                th: 'รหัสพนักงาน',
                en: 'Employee Code',
                cn: '员工编号',
            },
            firstname: {
                th: 'ชื่อ',
                en: 'First Name',
                cn: '名字',
            },
            lastname: {
                th: 'นามสกุล',
                en: 'Last Name',
                cn: '姓氏',
            },
            ot_credit: {
                th: 'OT Credit',
                en: 'OT Credit',
                cn: '加班积分',
            },
            vip_credit: {
                th: 'VIP Credit',
                en: 'VIP Credit',
                cn: 'VIP积分',
            },
            month: {
                th: 'เดือน',
                en: 'Month',
                cn: '月份',
            },
            year: {
                th: 'ปี',
                en: 'Year',
                cn: '年份',
            },
        };
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true, // Set the flag
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.filter = {
                    'filter.year': 2024,
                    'filter.month': 6,
                };
                this.creditService.datatable(dataTablesParameters).subscribe({
                    next: (resp: any) => {
                        callback({
                            recordsTotal: resp.meta.totalItems,
                            recordsFiltered: resp.meta.totalItems,
                            data: resp.data,
                        });
                    },
                });
            },
            columns: [
                {
                    title: menuTitles.sequence[this.langues],
                    data: 'no',
                    className: 'w-15 text-center',
                },
                {
                    title: menuTitles.employee_code[this.langues],
                    data: 'member.code',
                    className: 'text-left',
                },
                {
                    title: menuTitles.firstname[this.langues],
                    data: 'member.firstname',
                    className: 'text-left',
                },
                {
                    title: menuTitles.lastname[this.langues],
                    data: 'member.lastname',
                    className: 'text-left',
                },
                {
                    title: menuTitles.ot_credit[this.langues],
                    data: 'creditEL2',
                    className: 'text-left',
                },
                {
                    title: menuTitles.vip_credit[this.langues],
                    data: 'creditEL4',
                    className: 'text-left',
                },
                {
                    title: menuTitles.month[this.langues],
                    data: 'month',
                    className: 'text-center',
                },
                {
                    title: menuTitles.year[this.langues],
                    data: 'year',
                    className: 'text-center h-10',
                },
                // {
                //     title: 'จัดการ',
                //     data: null,
                //     defaultContent: '',
                //     ngTemplateRef: {
                //         ref: this.btNg,
                //     },
                //     className: 'w-15 text-center'
                // }
            ],
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

    opendialogapro() {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

    openDialogEdit(item: any) {
        const DialogRef = this.dialog.open(DialogForm, {
            disableClose: true,
            width: '500px',
            height: 'auto',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'EDIT',
                value: item,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
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
                this.creditService.delete(id).subscribe({
                    error: (err) => {},
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
}
