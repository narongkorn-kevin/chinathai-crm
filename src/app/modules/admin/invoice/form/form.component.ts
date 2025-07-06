import { data } from 'jquery';
import { map, Subject, Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    OnChanges,
    Inject,
    ChangeDetectorRef,
    ViewChild,
    ChangeDetectionStrategy,
    AfterViewInit,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { LocationService } from 'app/location.service';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { serialize } from 'object-to-formdata';
// import { DialogStockInComponent } from '../../dialog/dialog-stock-in/dialog.component';
import { MatTableModule } from '@angular/material/table';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';
import { InvoiceService } from '../invoice.service';

@Component({
    selector: 'app-delivery-order-form',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    imports: [
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatDatepickerModule,
        MatCheckbox,
        MatDivider,
        MatIcon,
        ImageUploadComponent,
        RouterLink,
        MatTableModule,
        MatCheckboxModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        CdkMenuModule,
        MatTabsModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatBadgeModule,
        SelectImporterComponent,
        SelectMemberComponent,
        UploadFileComponent,
    ],
    changeDetection: ChangeDetectionStrategy.Default,
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
})
export class FormComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    @ViewChild('checkbox') checkbox: any;

    form: FormGroup;
    type: string;

    data: any;
    lists = [];
    transports= [];
    provinces = [];
    Id: number;
    transportBy: string;
    dataRow: any[] = [];


    constructor(
        private formBuilder: FormBuilder,
        public _service: InvoiceService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.type = this.activated.snapshot.data?.type;
        this.Id = this.activated.snapshot.params?.id;
        this.data = this.activated.snapshot.data?.data?.data;
        this.transports = this.activated.snapshot.data?.transports?.data;

        this.form = this.formBuilder.group({
            code: [''],
            estimated_arrival_date: [''],
            address: [''],
            customer_type: [''],
            remark: [''],

            transport_ek: [false],
            transport_sea: [false],
            transport_fl: [false],
            transport_rw: [false],
            transport_aw: [false]
        });
        if(this.type === 'EDIT') {
            this.form.patchValue({
                ...this.data,
                transport_ek: this.data.transport_channels?.includes('EK'),
                transport_sea: this.data.transport_channels?.includes('SEA'),
                transport_fl: this.data.transport_channels?.includes('FL'),
                transport_rw: this.data.transport_channels?.includes('RW'),
                transport_aw: this.data.transport_channels?.includes('AW')
            });
        }
    }

    ngOnInit(): void {
        setTimeout(() => this.loadTable());
    }
    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._service
                    .datatablepo(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            console.log('API Response:', resp);
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
                    title: 'รหัสใบรับเข้าคลัง',
                    data: 'date',
                    className: 'text-center',
                },
                {
                    title: 'Packing list',
                    data: 'create_by',
                    className: ' text-center',
                },
                {
                    title: 'ลูกค้า',
                    data: 'create_by',
                    className: ' text-center',
                },

                {
                    title: 'ค่าใช้จ่ายรวม',
                    data: 'create_by',
                    className: ' text-center',
                },
                {
                    title: 'ค่าใช้จ่ายฝั่งจีน',
                    data: 'create_by',
                    className: ' text-center',
                },
                {
                    title: 'เครดิต',
                    data: 'create_by',
                    className: ' text-center',
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

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }


    Submit() {
        console.log('form', this.form.value);

        if (this.form.invalid) {
            console.log('form', this.form.value);
            this.form.markAllAsTouched();
            return;
        }
        const transportChannels = [
            this.form.get('transport_ek').value ? 'EK' : null,
            this.form.get('transport_sea').value ? 'SEA' : null,
            this.form.get('transport_fl').value ? 'FL' : null,
            this.form.get('transport_rw').value ? 'RW' : null,
            this.form.get('transport_aw').value ? 'AW' : null
        ].filter(channel => channel !== null);

        // Format the date before submitting
        const formValue = {
            ...this.form.value,
            transport_channels: transportChannels
        };
        // formValue.date = new Date(formValue.date).toISOString().split('T')[0];

        const confirmation = this.fuseConfirmationService.open({
            title: 'ยืนยันการบันทึกข้อมูล',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'primary',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const payload = { ...formValue };
                // if (this.type === 'NEW') {
                //     console.log('form', payload);
                //     this._service.create(payload).subscribe({
                //         next: (resp: any) => {
                //             this.toastr.success('บันทึกข้อมูลสำเร็จ');
                //             this._router.navigate(['lot']);
                //         },
                //         error: (err) => {
                //             this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                //         },
                //     });
                // } else {
                //     this._service.update(payload, this.Id).subscribe({
                //         next: (resp: any) => {
                //             this.toastr.success('แก้ไขข้อมูลสำเร็จ');
                //             this._router.navigate(['lot']);
                //         },
                //         error: (err) => {
                //             this.toastr.error('แก้ไขข้อมูลไม่สำเร็จ');
                //         },
                //     });
                // }
                this.toastr.success('บันทึกข้อมูลสำเร็จ');
                this._router.navigate(['invoice']);
            }
        });
    }

    Close() {
        this._router.navigate(['invoice']);
    }

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
}
