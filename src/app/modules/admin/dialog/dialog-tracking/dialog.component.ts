import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { DeliveryOrdersService } from '../../delivery_orders/delivery-orders.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-dialog-update-payment-new-product-form-addressed-3',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatCheckboxModule,
    ],
})
export class DialogTrackingComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    tracks = [];
    @ViewChild('checkbox') checkbox: any;

    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('dt') dt: DataTableDirective;
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptions: any = {};
    datarow = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogTrackingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        public _service: DeliveryOrdersService
    ) {
        console.log(data, 'data');
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

        const trackingInput = document.getElementById(
            'trackingInput'
        ) as HTMLInputElement;
        const inputObservable = new Observable((observer) => {
            trackingInput.addEventListener('input', () =>
                observer.next(trackingInput.value)
            );
        });

        inputObservable
            .pipe(debounceTime(500))
            .subscribe(() => this.rerender());
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }
    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
        // Also destroy the DataTable instances
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }
    loadTable(): void {
        const menuTitles = {
            creation_date: {
                th: 'วันที่สร้าง',
                en: 'Creation Date',
                cn: '创建日期',
            },
            tracking_number: {
                th: 'Tracking / เลขพัสดุ',
                en: 'Tracking/Parcel Number',
                cn: '追踪/包裹号码',
            },
        };

        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            searching: false,
            language: {
                url: this.languageUrl,
            },
            ajax: (dataTablesParameters: any, callback) => {
                  // ตรวจสอบว่ามีการกรอกข้อมูลบางอย่างก่อน
                
                const trackingInput = (
                    document.getElementById('trackingInput') as HTMLInputElement
                ).value;
                  // ตรวจสอบว่ามีการกรอกข้อมูลบางอย่างก่อน
                const isEmptyFilter = !trackingInput;

                if (isEmptyFilter) {
                    // ส่งข้อมูลเปล่ากลับไป (ยังไม่โหลดข้อมูล)
                    callback({
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: [],
                    });
                    return;
                }
                dataTablesParameters.search.value = trackingInput; // Add search value
                this._service
                    .datatatacking(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            console.log('resp', this.data);
                            // ✅ 2. กรองไม่เอา id ที่มีใน FormArray
                            const filteredData = resp.data.filter(item => !this.data?.arrayTrack.includes(item.id));
                            console.log(filteredData);
                            
                            // ✅ 3. ตั้งค่าและส่งข้อมูลให้ DataTable
                            this.datarow = filteredData;
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: filteredData,
                            });
                        },
                    });
            },
            columns: [
                {
                    title: '',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.checkbox,
                    },
                    className: 'w-10 text-center',
                },
                {
                    title: '#',
                    data: 'No',
                    className: 'w-10 text-center',
                },
                {
                    title: menuTitles.creation_date[this.langues],
                    data: 'date',
                    className: 'text-center',
                },
                {
                    title: menuTitles.tracking_number[this.langues],
                    data: 'track_no',
                    className: 'text-center',
                },
            ],
        };
    }

    Submit() {
        // if (this.form.invalid) {
        //     this.toastr.error(
        //         this.translocoService.translate('toastr.missing_fields')
        //     );
        //     this.form.markAllAsTouched();
        //     return;
        // }
        const trackingInput = (
            document.getElementById('trackingInput') as HTMLInputElement
        ).value;

        if (this.selectedItem) {
            this.multiSelect.push(this.selectedItem)
        }

        if (this.multiSelect.length === 0 && trackingInput) {
            const confirmation = this.fuseConfirmationService.open({
                title: this.translocoService.translate(
                    'confirmation.confirm_add_tracking'
                ),
                message: this.translocoService.translate(
                    'confirmation.confirm_add_trackingmessage'
                ),
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'primary',
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
                    const formdata = {
                        track_no: trackingInput,
                        date: new Date().toISOString().split('T')[0],
                    };
                    this._service.createTracking(formdata).subscribe({
                        next: (response: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.add')
                            );
                            this.dialogRef.close(response.data);
                        },
                        error: (error) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.add_error'
                                )
                            );
                            console.log(error);
                        },
                    });
                }
            });
        } else {
            //ตรวจสอบ track_no ที่ไม่ซ้ำของเดิมให้แสดงแจ้งเตือน
            if (this.multiSelect.length > 0) {
                const trackNos: string[] = this.multiSelect.map((item) => item.track_no);
                const unseen = trackNos.filter((trackNo) => !(this.data.selected.map((item) => item.track_no).includes(trackNo)));
                if (unseen.length > 0) {
                    const confirmation = this.fuseConfirmationService.open({
                        title: `Tracking ${unseen.join(', ')} ` + this.translocoService.translate('confirmation.title_not_use'),
                        icon: {
                            show: true,
                            name: 'heroicons_outline:exclamation-triangle',
                            color: 'primary',
                        },
                        actions: {
                            confirm: {
                                show: true,
                                label: this.translocoService.translate('confirmation.confirm_button'),
                                color: 'primary',
                            },
                            cancel: {
                                show: true,
                                label: this.translocoService.translate('confirmation.cancel_button'),
                            },
                        },
                        dismissible: false,
                    });

                    confirmation.afterClosed().subscribe((result) => {
                        if (result == 'confirmed') {
                            this.dialogRef.close(this.multiSelect);
                        }
                    });
                } else {
                    this.dialogRef.close(this.multiSelect);
                }

            }
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isAllSelected: boolean): void {
        this.isAllSelected = isAllSelected; // อัปเดตสถานะเลือกทั้งหมด

        if (isAllSelected) {
            // เลือกทั้งหมด: เพิ่ม object ของทุกแถวใน multiSelect
            this.datarow.forEach((row: any) => {
                if (!this.multiSelect.some((item) => item.id === row.id)) {
                    this.multiSelect.push(row); // เพิ่ม object ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ object ของทุกแถวออกจาก multiSelect
            this.datarow.forEach((row: any) => {
                const index = this.multiSelect.findIndex(
                    (item) => item.id === row.id
                );
                if (index !== -1) {
                    this.multiSelect.splice(index, 1); // ลบ object ออกจาก multiSelect
                }
                row.selected = false; // ตั้งค่า selected เป็น false
            });
        }
    }
    selectedItem: any = null;
    onCheckboxChange(event: any, row: any): void {
        if (event.checked) {
            // ยกเลิกตัวเลือกอื่นทั้งหมด
            this.datarow.forEach((item: any) => {
                if (item !== row) {
                    item.selected = false;
                }
            });

            // ตั้งค่าตัวที่ถูกเลือก
            row.selected = true;
            this.selectedItem = row;
        } else {
            row.selected = false;
            this.selectedItem = null;
        }
    }
}
