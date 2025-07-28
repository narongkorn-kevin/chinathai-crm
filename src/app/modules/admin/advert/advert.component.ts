import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { forkJoin, map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';
import { ProductComposeComponent } from '../product/dialog/product-compose/product-compose.component';
import { AdvertService } from './advert.service';
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
import { AdvertComponent } from './dialog-compose-advert/dialog-compose-advert.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import {
    CdkDrag,
    CdkDropList,
    DragDropModule,
    moveItemInArray,
    CdkDragDrop,
} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-advert',
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
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatCheckbox,
        RouterLink,
        MatIcon,
        DragDropModule,
        CdkDropList,
        CdkDrag,
    ],
    providers: [CurrencyPipe],
    templateUrl: './advert.component.html',
    styleUrl: './advert.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class HomeBannerComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dataRow: any[] = [];
    get_ads: any[] = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    @ViewChild('pic') pic: any;
    @ViewChild('checkbox_head') checkbox_head: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('action') action: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    constructor(
        private translocoService: TranslocoService,
        private _service: AdvertService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private currencyPipe: CurrencyPipe,
        private _router: Router,
        private _fb: FormBuilder,
        private activated: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.get_ads = this.activated.snapshot.data.get_ads?.data;
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

    onChangeType() {
        this.rerender();
    }

    rows: any[] = [];

    loadTable(): void {
        const menuTitles = {
            seq: { th: 'ลำดับ', en: 'Sequence', cn: '顺序' },
            image: { th: 'รูปภาพ', en: 'Image', cn: '图片' },
        };
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.type = 'home';
                this._service
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
                            console.log(this.dataRow, 'dataRow');

                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data,
                            });
                        },
                    });
            },
            order: [[0, 'asc']],
            columns: [
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.checkbox,
                    },
                    className: 'w-10 text-center drag-handle',
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
                    title: menuTitles.seq[this.langues],
                    data: 'seq',
                    className: 'w-20 text-center',
                },
                {
                    title: menuTitles.image[this.langues],
                    data: 'image',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.pic,
                    },
                },
            ],
        };
    }
    dropBanner(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.get_ads, event.previousIndex, event.currentIndex);
    }

    updateBannerSequence() {
        const updateRequests = this.get_ads.map((ads, index) => {
            const updatedBanner = {
                url: ads.url,
                icon: ads.icon,
                seq: (index + 1).toString(),
            };

            return this._service.update(updatedBanner, ads.id);
        });

        forkJoin(updateRequests).subscribe({
            next: () => {
                this.toastr.success(
                    this.translocoService.translate('toastr.update')
                );
                this._service.getAds().subscribe((resp: any) => {
                    this.get_ads = resp.data;
                    this._changeDetectorRef.markForCheck();
                });
            },
            error: (err) => {
                this.toastr.error(
                    this.translocoService.translate('toastr.update_error')
                );
                console.error('Banner sequence update error:', err);
            },
        });
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    openDialogAdd() {
        const DialogRef = this.dialog.open(AdvertComponent, {
            width: '70%',
            data: {
                seq: this.get_ads.length + 1,
                action: 'NEW',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            this._service.getAds().subscribe((resp: any) => {
                this.get_ads = resp.data;
                this._changeDetectorRef.markForCheck();
            });
        });
    }

    openDialogEdit(data: any) {
        const DialogRef = this.dialog.open(AdvertComponent, {
            width: '70%',
            data: {
                action: 'EDIT',
                data: data,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            this._service.getAds().subscribe((resp: any) => {
                this.get_ads = resp.data;
                this._changeDetectorRef.markForCheck();
            });
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
                console.log(id, 'id');

                const deleteRequests = id.map((itemId) =>
                    this._service.delete(itemId)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.delete')
                        );
                        this.multiSelect = [];
                        this._service.getAds().subscribe((resp: any) => {
                            this.get_ads = resp.data;
                            this.updateBannerSequence();
                            this._changeDetectorRef.markForCheck();
                        });
                    },
                    error: (err) => {
                        this.toastr.error(
                            this.translocoService.translate(
                                'toastr.delete_error'
                            )
                        );
                        console.log(err, 'err');
                        this._service.getAds().subscribe((resp: any) => {
                            this.get_ads = resp.data;
                            this._changeDetectorRef.markForCheck();
                        });
                    },
                });
            }
        });
    }

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม id ของทุกแถวใน multiSelect
            this.get_ads.forEach((row: any) => {
                if (!this.multiSelect.includes(row.id)) {
                    this.multiSelect.push(row.id); // เพิ่ม id ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ id ของทุกแถวออกจาก multiSelect
            this.get_ads.forEach((row: any) => {
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
}
