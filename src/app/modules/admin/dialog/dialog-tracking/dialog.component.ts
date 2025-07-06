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
@Component({
    selector: 'app-dialog-update-payment-new-product-form-addressed-3',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
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
    ],
})
export class DialogTrackingComponent implements OnInit {
    form: FormGroup;
    stores: any[] = [];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    tracks = [];
    @ViewChild('checkbox') checkbox: any;

    @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
    @ViewChild('dt') dt: DataTableDirective;
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptions: any = {};
    datarow = [];


    constructor(
        private dialogRef: MatDialogRef<DialogTrackingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        public _service: DeliveryOrdersService,

    ) {
        console.log(data, 'data');
    }

    ngOnInit(): void {
        setTimeout(() => this.loadTable());

        const trackingInput = document.getElementById('trackingInput') as HTMLInputElement;
        const inputObservable = new Observable((observer) => {
            trackingInput.addEventListener('input', () => observer.next(trackingInput.value));
        });

        inputObservable.pipe(debounceTime(500)).subscribe(() => this.rerender());
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
            this.dtOptions = {
                pagingType: 'full_numbers',
                serverSide: true,
                searching: false,
                ajax: (dataTablesParameters: any, callback) => {
                    const trackingInput = (document.getElementById('trackingInput') as HTMLInputElement).value;
                    dataTablesParameters.search.value = trackingInput; // Add search value
                    this._service
                        .datatatacking(dataTablesParameters)
                        .pipe(map((resp: { data: any }) => resp.data))
                        .subscribe({
                            next: (resp: any) => {
                                console.log('resp', resp);
                                this.datarow = resp.data;
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
                        title: 'วันที่สร้าง',
                        data: 'date',
                        className: 'text-center',
                        // ngTemplateRef: {
                        //     ref: this.date,
                        // },
                    },
                    {
                        title: 'Tracking / เลขพัสดุ',
                        data: 'track_no',
                        className: 'text-center',
                    },
                ],
            };
        }

    Submit() {
        const trackingInput = (document.getElementById('trackingInput') as HTMLInputElement).value;

        if (this.multiSelect.length === 0 && trackingInput) {
            const confirmation = this.fuseConfirmationService.open({
                title: 'ยืนยันการสร้าง track ใหม่หรือไม่',
                message: "เนื่องจากคุณไม่ได้เลือกข้อมูลใด ๆ ที่จะนำเข้า คุณต้องการสร้าง track ใหม่หรือไม่",
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
                    const formdata = {
                        track_no: trackingInput,
                        date: new Date().toISOString().split('T')[0]
                    }
                    this._service.createTracking(formdata).subscribe({
                        next: (response:any) => {
                            this.toastr.success('สร้าง Tracking สำเร็จ');
                            this.dialogRef.close(response.data);
                        },
                        error: (error) => {
                            this.toastr.error('Failed to create tracking number');
                            console.log(error);
                        }
                    });
                }
            });

        } else {
            const confirmation = this.fuseConfirmationService.open({
                title: 'ยืนยันการนำเข้าข้อมูล',
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
                    this.dialogRef.close(this.multiSelect);
                }
            });
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
                if (!this.multiSelect.some(item => item.id === row.id)) {
                    this.multiSelect.push(row); // เพิ่ม object ถ้ายังไม่มีใน multiSelect
                }
                row.selected = true; // ตั้งค่า selected เป็น true
            });
        } else {
            // ยกเลิกการเลือกทั้งหมด: ลบ object ของทุกแถวออกจาก multiSelect
            this.datarow.forEach((row: any) => {
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
}
