import { data } from 'jquery';
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
import { DeliveryNoteService } from './delivery-note.service';
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
import { DialogChooseComponent } from './dialog-choose/dialog-choose.component';
import { DialogViewImageComponent } from 'app/modules/common/dialog-view-image/dialog-view-image.component';

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
    templateUrl: './delivery-note.component.html',
    styleUrl: './delivery-note.component.scss',
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
export class DeliveryNoteComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild('btNg') btNg: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('view') view: any;
    @ViewChild('view_order') view_order: any;

    @ViewChild('pic_car') pic_car: any;
    @ViewChild('pic_pro') pic_pro: any;
    @ViewChild('pic_bill') pic_bill: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    showAdvancedFilters: boolean = false;
    showFilters: boolean = true;
    dataRow: any[] = [];
    rows: any[] = [];
    transports = [];

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    constructor(
        private http: HttpClient,
        private _service: DeliveryNoteService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private _router: Router,
        private FormBuilder: FormBuilder,
        private activated: ActivatedRoute
    ) {
        this.transports = this.activated.snapshot.data.transports?.data;

        this.filterForm = this.FormBuilder.group({
            date: [''],
            start_date: [''],
            end_date: [''],
            code: [''],
            shipment: [''],
            standard_size_id: [''],
            category_product:['']
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
                    title: 'วันที่',
                    data: 'date',
                    className: 'text-center',
                },
                {
                    title: 'หมายเลขจัดส่ง',
                    data: 'code',
                    className: ' text-center',
                    ngTemplateRef: {
                        ref: this.view,
                    },
                },
                {
                    title: 'ประเภทการส่งของ',
                    data: 'code',
                    className: ' text-center',
                    ngTemplateRef: {
                        ref: this.view_order,
                    },
                },
                {
                    title: 'สถานะใบแจ้งหนี้',
                    data: 'create_by',
                    className: ' text-center',
                },
                {
                    title: 'สถานะใบส่งของ',
                    data: 'create_by',
                    className: ' text-center',
                },
                {
                    title: 'รูปรถ',
                    data: 'create_by',
                    className: ' text-center',
                    ngTemplateRef: {
                        ref: this.pic_car,
                    },
                },
                {
                    title: 'รูปสินค้า',
                    data: 'create_by',
                    className: ' text-center',
                    ngTemplateRef: {
                        ref: this.pic_pro,
                    },
                },
                {
                    title: 'รูปบิลสินค้า',
                    data: 'create_by',
                    className: ' text-center',
                    ngTemplateRef: {
                        ref: this.pic_bill,
                    },
                },
                {
                    title: 'ลูกค้า',
                    data: 'create_by',
                    className: ' text-center',
                },
                {
                    title: 'ที่อยู่',
                    data: 'create_by',
                    className: ' text-center',
                },
                {
                    title: 'ช่วงเวลา',
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
            //                 this.rerender();
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

                const deleteRequests = id.map((itemId) =>
                    this._service.delete(itemId)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.toastr.success('ลบรายการสมาชิก สำเร็จ');
                        this.multiSelect = [];
                        this.rerender();
                    },
                    error: (err) => {
                        this.toastr.error(
                            'ลบรายการสมาชิก ล้มเหลว โปรดลองใหม่อีกครั้งภายหลัง'
                        );
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

    checkdata(data:any){
        if(data?.status == null){
            const DialogRef = this.dialog.open(DialogChooseComponent, {
                disableClose: true,
                width: '50%',
                maxHeight: '90vh',
                enterAnimationDuration: 300,
                exitAnimationDuration: 300,
                data: {
                },
            });
            DialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    console.log(result, 'result');
                    this.rerender();
                }
            });
        }else{
            this._router.navigate(['/delivery-note/view-order/' + data?.id]);
        }
    }

    dialogviewimage(title:string){
        const DialogRef = this.dialog.open(DialogViewImageComponent, {
            disableClose: true,
            width: '50%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                can_add: false,
                title: title,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                this.rerender();
            }
        });
    }

}
