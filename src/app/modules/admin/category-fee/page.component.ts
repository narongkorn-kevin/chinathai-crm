import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CategoryFeeService } from './page.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, Subject } from 'rxjs';
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
    selector: 'app-page-category-fee',
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
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CategoryFeeComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private _Service: CategoryFeeService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private translocoService: TranslocoService
    ) {
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;
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
        const tabletitles = {
            "num": { "th": "ลำดับ", "en": "Number", "cn": "编号" },
            "name": { "th": "ชื่อ", "en": "Name", "cn": "名称" },
            "type": { "th": "ประเภท", "en": "Type", "cn": "类别" },
            "meneg": { "th": "จัดการ", "en": "Manage", "cn": "管理" }
        };
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true, // Set the flag
            scrollX: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                this._Service
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
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
                    title: tabletitles.num[this.langues],
                    data: 'No',
                    className: 'w-15 text-center',
                },
                {
                    title: tabletitles.name[this.langues],
                    data: 'name',
                    defaultContent: '',
                    className: 'text-center min-w-20',
                },
                {
                    title: tabletitles.type[this.langues],
                    data: 'type',
                    defaultContent: '',
                    className: 'text-left',
                },

                {
                    title: tabletitles.meneg[this.langues],
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btNg,
                    },
                    className: 'w-15 text-center',
                },
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
        const tabletitles = {
            messages: {
                th: 'กรุณาตรวจสอบข้อมูล หากลบข้อมูลแล้วจะไม่สามารถนำกลับมาได้',
                en: 'Please check the information carefully. Once deleted, the data cannot be recovered.',
                cn: '请仔细检查信息，删除后数据将无法恢复。'
            },
            confirm: { th: 'ยืนยัน', en: 'Confirm', cn: '确认' },
            cancel: { th: 'ยกเลิก', en: 'Cancel', cn: '取消' },
            confiredelete: { th: 'ยืนยันลบข้อมูล', en: 'Confirm delete data', cn: '确认删除数据' },
            sussesdelete: { th: 'ดำเนินการลบสำเร็จ', en: 'Successfully deleted', cn: '成功删除' },
        }
        const confirmation = this.fuseConfirmationService.open({
            title: tabletitles.confiredelete[this.langues],
            message: tabletitles.messages[this.langues],
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: tabletitles.confirm[this.langues],
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: tabletitles.cancel[this.langues],
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this._Service.delete(id).subscribe({
                    error: (err) => {},
                    complete: () => {
                        this.toastr.success(tabletitles.sussesdelete[this.langues]);
                        this.rerender();
                    },
                });
            }
        });
    }
}
