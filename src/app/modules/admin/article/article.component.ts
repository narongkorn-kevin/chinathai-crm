import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { debounceTime, map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';
import { ArticleService } from './article.service';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
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
import { DialogComposeArticleComponent } from './dialog-compose-article/dialog-compose-article.component';
import { ImageViewerComponent } from 'app/modules/common/image-viewer/image-viewer.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-article',
    standalone: true,
    imports: [
        TranslocoModule,
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
    providers: [CurrencyPipe],
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
    templateUrl: './article.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleComponent implements OnInit, AfterViewInit {
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
        private translocoService: TranslocoService,
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
        });
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
        this.filterForm.valueChanges.pipe(debounceTime(600)).subscribe(() => {
            this.rerender();
        });
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
        this.rerender();
    }

    rows: any[] = [];

    loadTable(): void {
        const menuTitles = {
            image: {
                th: 'รูปภาพ',
                en: 'Image',
                cn: '图片',
            },
            category_name: {
                th: 'ชื่อหมวดหมู่',
                en: 'Category Name',
                cn: '分类名称',
            },
            article_title: {
                th: 'หัวข้อบทความ',
                en: 'Article Title',
                cn: '文章标题',
            },
            status: {
                th: 'สถานะ',
                en: 'Status',
                cn: '状态',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                if (this.filterForm.value.packinglist_no) {
                    dataTablesParameters.packinglist_no = this.filterForm.value.packinglist_no;
                }
                dataTablesParameters.search.value = this.filterForm.value.name;
                this._service
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
            order: [[0, 'desc']],
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
                    title: menuTitles.image[this.langues],
                    data: 'image',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.pic,
                    },
                },
                {
                    title: menuTitles.category_name[this.langues],
                    data: function (row: any) {
                        if (!row?.category_news) {
                            return '-';
                        }
                        return row?.category_news?.name;
                    },
                    className: 'text-center',
                },
                {
                    title: menuTitles.article_title[this.langues],
                    data: 'name',
                    className: 'text-center',
                },
                {
                    title: menuTitles.status[this.langues],
                    data: 'status',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.status,
                    },
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

    openForm() {
        this._router.navigate(['member/form']);
    }

    openDialogAdd() {
        const DialogRef = this.dialog.open(DialogComposeArticleComponent, {
            width: '50%',
            maxHeight: '90vh',
            data: {
                action: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
    }

    openDialogEdit(data: any) {
        const DialogRef = this.dialog.open(DialogComposeArticleComponent, {
            width: '50%',
            maxHeight: '90vh',
            data: {
                action: 'EDIT',
                value: data,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
    }

    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate(
                'confirmation.delete_title2'
            ),
            message: this.translocoService.translate(
                'confirmation.delete_message2'
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
                const id = this.multiSelect;

                for (let i = 0; i < id.length; i++) {
                    this._service.delete(id[i]).subscribe({
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.delete_error'
                                )
                            );
                            console.log(err, 'err');
                        },
                        complete: () => {
                            if (i == id.length - 1) {
                                this.multiSelect = [];
                                this.toastr.success(
                                    this.translocoService.translate(
                                        'toastr.delete'
                                    )
                                );
                                this.rerender();
                            }
                        },
                    });
                }
                if (id.length === 1) {
                    this.rerender();
                }
            }
        });
    }
    // showPicture(imgObject: string): void {
    //     console.log(imgObject)
    //     this.dialog
    //         .open(PictureComponent, {
    //             autoFocus: false,
    //             data: {
    //                 imgSelected: imgObject,
    //             },
    //         })
    //         .afterClosed()
    //         .subscribe(() => {
    //             // Go up twice because card routes are setup like this; "card/CARD_ID"
    //             // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
    //         });
    // }

    multiSelect: any[] = [];
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

    openImageViewer(imageUrl: string): void {
        this.dialog.open(ImageViewerComponent, {
            width: '80%',
            height: '80%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            data: {
                imageUrl: imageUrl,
            },
        });
    }
}
