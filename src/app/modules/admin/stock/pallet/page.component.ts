import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { forkJoin, map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { PalletService } from './pallet.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        CdkMenuModule,
        DecimalPipe,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        RouterLink,
        SelectMemberComponent,
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [CurrencyPipe, DecimalPipe],
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
export class PalletComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild('btNg') btNg: any;
    @ViewChild('textStatus') textStatus: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('gotoRoute') gotoRoute: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    showAdvancedFilters: boolean = false;
    showFilters: boolean = true;
    dataRow: any[] = [];
    rows: any[] = [];
    standard_size = [];


    sumdashboard = {
        pallet_summary: {
            truck: {
                pallet_count: 1870,
                total_packages: 1870,
                total_weight_kg: 1870,
                total_cbm: 1870,
            },
            ship: {
                pallet_count: 1870,
                total_packages: 1870,
                total_weight_kg: 1870,
                total_cbm: 1870,
            },
        },
    };
    filterForm: FormGroup;
    showFilterForm: boolean = false;

    constructor(
        private http: HttpClient,
        private _service: PalletService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router,
        private FormBuilder: FormBuilder,
        private activated: ActivatedRoute,
    ) {
        this.standard_size = this.activated.snapshot.data.standard_size?.data;

        this.filterForm = this.FormBuilder.group({
            start_date: [''],
            end_date: [''],
            code: [''],
            shipment: [''],
            standard_size_id: [''],
        });
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
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
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
                    title: 'วันที่เข้าโกดัง',
                    data: 'received_date',
                    className: 'w-10 text-center',
                    // ngTemplateRef: {
                    //     ref: this.date,
                    // },
                },
                {
                    title: 'รหัสพาเลท',
                    data: 'code',
                    className: 'text-center',
                    ngTemplateRef: {
                        ref: this.gotoRoute,
                    },
                },
                {
                    title: 'ประเภท',
                    data: function (row: any) {
                        if(!row.shipped_by){
                            return '-';
                        }
                        if(row.shipped_by == 'Car'){
                            return 'ขนส่งทางรถ';
                        }else if(row.shipped_by == 'Ship'){
                            return 'ขนส่งทางเรือ';
                        }else if(row.shipped_by == 'Train'){
                            return 'ขนส่งทางรถไฟ';
                        }else{
                            return row.shipped_by
                        }
                    },
                    className: 'text-center',
                },
                {
                    title: 'น้ำหนัก(Kg.)',
                    data: function (row: any) {
                        if(!row.weight_kg){
                            return '-';
                        }
                        return row.weight_kg;
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
                {
                    title: 'จำนวนชิ้น',
                    data: function (row: any) {
                        if(!row.total_packages){
                            return '-';
                        }
                        return row.total_packages;
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

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    goToPalletForm() {
        this._router.navigate(['/pallet-form']);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
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
    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการ?',
            message:
                'คุณกำลังจะ ลบรายการ หากกดยืนยันแล้วจะไม่สามารถเอากลับมาอีกได้',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
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
            // if (result == 'confirmed') {
            //     const id = this.multiSelect;
            //     console.log(id, 'id');

            //     for (let i = 0; i < id.length; i++) {
            //         this._service.delete(id[i]).subscribe({
            //             error: (err) => {
            //                 this.toastr.error(
            //                     'ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง'
            //                 );
            //                 console.log(err, 'err');
            //             },
            //             complete: () => {
            //                 if (i == id.length - 1) {
            //                     this.multiSelect = [];
            //                     this.toastr.success('ลบรายการสมาชิก สำเร็จ');
            //                     this.rerender();
            //                 }
            //             },
            //         });
            //     }
            //     if (id.length === 1) {
            //         this.rerender();
            //     }
            // }
            if (result == 'confirmed') {
                const id = this.multiSelect;
                console.log(id, 'id');

                const deleteRequests = id.map((itemId) => this._service.delete(itemId));

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.toastr.success('ลบรายการสมาชิก สำเร็จ');
                        this.multiSelect = [];
                        this.rerender();
                    },
                    error: (err) => {
                        this.toastr.error('ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง');
                        console.log(err, 'err');
                        this.rerender();
                    },
                });
            }
        });
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
    openForm() {
        this._router.navigate(['pallet/form']);
    }
}
