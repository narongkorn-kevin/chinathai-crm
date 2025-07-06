import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { DialogComposeArticleCategoryComponent } from './dialog-compose-article-category/dialog-compose-article-category.component';
import { ArticleService } from '../article.service';

@Component({
    selector: 'app-vendor',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatCheckbox,
        RouterLink,
        MatIcon,
    ],
    providers: [
        CurrencyPipe
    ],
    animations: [
        trigger('slideToggleFilter', [
            state(
                'open',
                style({
                    height: '*',
                    opacity: 1,
                    overflow: 'hidden',
                })
            ),
            state(
                'closed',
                style({
                    height: '0px',
                    opacity: 0,
                    overflow: 'hidden',
                })
            ),
            transition('open <=> closed', [animate('300ms ease-in-out')]),
        ]),
    ],
    templateUrl: './article-category.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleCategoryComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dataRow: any[] = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    @ViewChild('btNg') btNg: any;
    @ViewChild('pic') pic: any;
    @ViewChild('gotoRoute') gotoRoute: any;
    @ViewChild('checkbox_head') checkbox_head: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('date') date: any;
    @ViewChild('action') action: any;
    @ViewChild('link') link: any;
    @ViewChild('status') status: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private _service: ArticleService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe,
        private _router: Router,
        private _fb: FormBuilder

    ) {

        this.filterForm = this._fb.group({
            name: [''],
            start_date: [''],
            end_date: [''],
            code: [''],
            phone: [''],
        });
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

    onChangeType() {
        this.rerender()
    }

    rows: any[] = [];

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
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
                                data: resp.data,
                            });
                        }
                    })
            },
            order: [[3, 'asc']],
            columns: [
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.checkbox,
                    },
                    className: 'w-10 text-center',
                    orderable: false,
                },
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.action,
                    },
                    className: 'w-10 text-center',
                    orderable: false,
                },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                    orderable: false,
                },
                {
                    title: 'ชื่อหมวดหมู่',
                    data: 'category',
                    className: 'text-center',
                },
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

    openForm() {
        this._router.navigate(['member/form']);
    }

    openDialogAdd() {
        this.dialog.open(DialogComposeArticleCategoryComponent, {
            width: '50%',
            data: {
                action: 'NEW'
            }
        })
    }

    openDialogEdit(data: any) {
        this.dialog.open(DialogComposeArticleCategoryComponent, {
            width: '50%',
            data: {
                action: 'EDIT'
            }
        })
    }

    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการ ?",
            message: "คุณกำลังจะลบรายการ หากกดยืนยันแล้วจะไม่สามารถเอากลับมาอีกได้",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "warn"
            },
            actions: {
                confirm: {
                    show: true,
                    label: "ยืนยัน",
                    color: "primary"
                },
                cancel: {
                    show: true,
                    label: "ยกเลิก"
                }
            },
            dismissible: false
        })

        confirmation.afterClosed().subscribe(
            result => {
                if (result == 'confirmed') {
                    const id = this.multiSelect;

                    for (let i = 0; i < id.length; i++) {
                        // this._service.delete(id[i]).subscribe({
                        //     error: (err) => {
                        //         this.toastr.error('ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง');
                        //         console.log(err, 'err');
                        //     },
                        //     complete: () => {
                        //         if (i == id.length - 1) {
                        //             this.multiSelect = [];
                        this.toastr.success('ลบรายการสมาชิก สำเร็จ');
                        this.rerender();
                        //         }
                        //     },
                        // });
                    }
                    if (id.length === 1) {
                        this.rerender();
                    }
                }
            }
        )
    }

    multiSelect: any[] = []
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม id ของทุกแถวใน multiSelect
            this.dataRow.forEach((row: any) => {
                if (!this.multiSelect.includes(row.id)) {
                    this.multiSelect.push(row.id); // เพิ่ม id ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ id ของทุกแถวออกจาก multiSelect
            this.dataRow.forEach((row: any) => {
                const index = this.multiSelect.indexOf(row.id);
                if (index !== -1) {
                    this.multiSelect.splice(index, 1); // ลบ id ออกจาก multiSelect
                }
                row.selected = false; // ตั้งค่า selected เป็น false
            });
        }
    }
    onCheckboxChange(event: any, id: number): void {
        if (event.checked) {
            // เพิ่ม id เข้าไปใน multiSelect
            this.multiSelect.push(id);
        } else {
            // ลบ id ออกจาก multiSelect
            const index = this.multiSelect.indexOf(id);
            if (index !== -1) {
                this.multiSelect.splice(index, 1); // ใช้ splice เพื่อลบค่าออก
            }
        }
    }

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        console.log(filterValues);
        this.rerender();
    }
    clearFilter() {
        this.filterForm.reset();
        this.rerender();
    }

}
