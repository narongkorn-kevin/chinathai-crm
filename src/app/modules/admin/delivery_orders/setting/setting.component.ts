import { map, Subject, Subscription, forkJoin, takeUntil } from 'rxjs';
import { Component, OnInit, OnChanges, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { DeliveryOrdersService } from '../delivery-orders.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
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
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { data } from 'jquery';

@Component({
    selector: 'app-user-setting',
    standalone: true,
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
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
        MatSelectModule,
        ImageUploadComponent,
        RouterLink,
    ],
})
export class SettingComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
    filterForm: FormGroup;
    edit = true;
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    dataRow: any[] = [];
    form: FormGroup;

    constructor(
        private FormBuilder: FormBuilder,
        public _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private Service: DeliveryOrdersService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        private ChangeDetectorRef: ChangeDetectorRef
    ) {
        this.filterForm = this.FormBuilder.group({
            name: [''],
        });
        this.form = this.FormBuilder.group({
            data: this.FormBuilder.array([]),
        });
    }
    private destroy$ = new Subject<void>();
    ngOnInit(): void {
        // setTimeout(() => this.loadTable());
        this.loaddata();
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }

    onChangeType() {
        this.rerender();
    }
    rows: any[] = [];

    loaddata() {
        this._service.getsetting().subscribe({
            next: (resp: any) => {
                this.dataRow = resp.data;
                this.populateFormArray();
            },
        });
    }


    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true,
            searching: false,
            ajax: (dataTablesParameters: any, callback) => {
                this._service
                    .datatablesetting(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data)
                    ).subscribe({
                        next: (resp: any) => {
                            this.dataRow = resp.data;
                            this.populateFormArray();
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
                    title: 'รายการ',
                    data: 'name',
                    className: 'text-center',
                },
                {
                    title: 'กว้าง',
                    data: 'width',
                    className: 'text-center',
                },
                {
                    title: 'ยาว',
                    data: 'long',
                    className: 'text-center',
                },
                {
                    title: 'สูง',
                    data: 'height',
                    className: 'text-center',
                },
            ],
        };
    }

    populateFormArray(): void {
        const formArray = this.form.get('data') as FormArray;
        formArray.clear();
        this.dataRow.forEach(row => {
            formArray.push(this.FormBuilder.group({
                id: [row.id, Validators.required],
                name: [row.name, Validators.required],
                width: [row.width, Validators.required],
                long: [row.long, Validators.required],
                height: [row.height, Validators.required],
                weight: [row.weight, Validators.required],
            }));
        });
        console.log('form',this.form.value);
    }

    get dataFormArray(): FormArray {
        return this.form.get('data') as FormArray;
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
        this.edit = !this.edit;
    }

    opendialogdelete(id?:number) {
        const confirmation = this.fuseConfirmationService.open({
            title: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการ?",
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
                    console.log(id, 'id');

                    this._service.deletesetting(id).subscribe({
                        error: (err) => {
                            this.toastr.error('ลบรายการล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง');
                            console.log(err, 'err');
                        },
                        complete: () => {
                            this.toastr.success('ลบรายการสมาชิก สำเร็จ');
                            this.loadTable();
                            this.rerender();
                            this.ChangeDetectorRef.detectChanges();
                        },
                    });
                }
            }
        )
    }
    Submit() {
        if (this.form.invalid) {
            console.log('form', this.form.value);
            this.form.markAllAsTouched();
            return;
        }

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
                const dataArray = this.dataFormArray.controls.map(control => ({
                    id: control.get('id').value,
                    name: control.get('name').value,
                    width: control.get('width').value,
                    height: control.get('height').value,
                    long: control.get('long').value,
                    weight: control.get('weight').value,
                }));

                const updateObservables = dataArray.map(data => this.Service.updatesetting(data, data.id));

                forkJoin(updateObservables).subscribe({
                    next: () => {
                        this.toastr.success('บันทึกข้อมูลสำเร็จ');
                        this.rerender();
                    },
                    error: () => {
                        this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                    },
                });
            }
        });
    }
}
