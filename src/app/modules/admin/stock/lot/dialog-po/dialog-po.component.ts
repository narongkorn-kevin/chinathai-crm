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
import { HttpClient } from '@angular/common/http';
import { LotService } from '../lot.service';
import { MatDivider } from '@angular/material/divider';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
@Component({
    selector: 'app-dialog-scan-update-payment-new-product-form-addressed',
    standalone: true,
    templateUrl: './dialog-po.component.html',
    styleUrl: './dialog-po.component.scss',
    imports: [
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
        MatDivider,
        MatDatepickerModule,
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
})
export class DialogPoComponent implements OnInit {
    @ViewChild('checkbox') checkbox: any;
    @ViewChild(DataTableDirective, { static: false })dtElement: DataTableDirective;
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: any = {};
    addForm: FormGroup;
    tracks = [];
    dataRow: any[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogPoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        private _service: LotService,
        private formBuilder: FormBuilder,
    ) {
        this.filterForm = this.FormBuilder.group({
            start_date: [''],
            end_date: [''],
            in_store: [''],
            barcode: [''],
            sack_code: [''],
            member_code: [''],
            shipment: [''],
        });
        console.log(data, 'data');
    }

    ngOnInit(): void {
        this.form = this.FormBuilder.group({
            track_no: this.FormBuilder.array([]),
        });

        if (this.data.type === 'EDIT') {
            this.form.patchValue({
                ...this.data.value,
            });
        }

        this.updateFormArray();

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

    get trackNoArray(): FormArray {
        return this.form.get('track_no') as FormArray;
    }

    updateFormArray(): void {
        this.trackNoArray.clear();
        this.selectedTrackings.forEach((trackingNumber) => {
            this.trackNoArray.push(this.FormBuilder.control(trackingNumber));
        });
    }

    Submit() {
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
                const formValue = {
                    packing_list_id: this.data.Id,
                    delivery_order_lists: this.multiSelect.map((item) => ({
                        delivery_order_id: item.delivery_order_id,
                        delivery_order_list_id: item.delivery_order_list_id,
                    })),
                }
                this._service.addOrder(formValue).subscribe({
                    next: (resp: any) => {
                        this.toastr.success('บันทึกข้อมูลสำเร็จ');
                        this.dialogRef.close(this.multiSelect);
                    },
                    error: (err) => {
                        this.toastr.error('เกิดข้อผิดพลาด');
                        console.log(err);
                    }
                });
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    trackingItems = [
        { trackingNumber: 'AZ9999999999', selected: false },
        { trackingNumber: 'AZ9999999998', selected: false },
        { trackingNumber: 'AZ9999999997', selected: false },
        { trackingNumber: 'AZ9999999996', selected: false },
        { trackingNumber: 'AZ9999999995', selected: false },
    ];

    get selectedTrackings(): string[] {
        return this.trackingItems
            .filter((item) => item.selected)
            .map((item) => item.trackingNumber);
    }

    toggleAll(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        this.trackingItems.forEach((item) => (item.selected = checked));
        this.updateFormArray();
    }

    updateSelection(): void {
        const allSelected = this.trackingItems.every((item) => item.selected);
        (document.getElementById('selectAll') as HTMLInputElement).checked =
            allSelected;
        this.updateFormArray();
    }

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            scrollX: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._service
                    .datatableorderlist(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
                            console.log(resp, 'resp');

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
                    data: function (row: any) {
                        if(!row.delivery_order?.code){
                            return '-';
                        }
                        return row.delivery_order?.code;
                    },
                    className: 'text-center',
                },
                {
                    title: 'หมายเลขพาเลท',
                    data: function (row: any) {
                        if(!row.pallet?.name){
                            return '-';
                        }
                        return row.sack?.name;
                    },
                    className: 'text-center',
                },
                {
                    title: 'หมายเลขกระสอบ',
                    data: function (row: any) {
                        if(!row.sack?.name){
                            return '-';
                        }
                        return row.sack?.name;
                    },
                    className: 'text-center',
                },
                {
                    title: 'น้ำหนัก (Kg.)',
                    data: function (row: any) {
                        if(!row.weight){
                            return '-';
                        }
                        return row.weight;
                    },
                    className: 'text-center',
                },
                {
                    title: 'CBM',
                    data: function (row: any) {
                        if(!row.cbm){
                            return '-';
                        }
                        return row.cbm;
                    },
                    className: 'text-center',
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

    multiSelect: any[] = [];
    isAllSelected: boolean = false; // ใช้เก็บสถานะเลือกทั้งหมด

    toggleSelectAll(isSelectAll: boolean): void {
        this.isAllSelected = isSelectAll; // อัปเดตสถานะเลือกทั้งหมด

        if (isSelectAll) {
            // เลือกทั้งหมด: เพิ่ม object ของทุกแถวใน multiSelect
            this.dataRow.forEach((row: any) => {
                if (!this.multiSelect.some(item => item.id === row.id)) {
                    this.multiSelect.push(row); // เพิ่ม object ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ object ของทุกแถวออกจาก multiSelect
            this.dataRow.forEach((row: any) => {
                const index = this.multiSelect.findIndex(item => item.id === row.id);
                if (index !== -1) {
                    this.multiSelect.splice(index, 1); // ลบ object ออกจาก multiSelect
                }
                row.selected = false; // ตั้งค่า selected เป็น false
            });
        }
    }

    onCheckboxChange(event: any, row: any): void {
        if (event.checked) {
            // เพิ่ม object เข้าไปใน multiSelect
            this.multiSelect.push(row);
        } else {
            // ลบ object ออกจาก multiSelect
            const index = this.multiSelect.findIndex(item => item.id === row.id);
            if (index !== -1) {
                this.multiSelect.splice(index, 1); // ใช้ splice เพื่อลบค่าออก
            }
        }
    }

    filterForm: FormGroup;
    showFilterForm: boolean = false;
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
