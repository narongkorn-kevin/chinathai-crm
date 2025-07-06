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
import { PalletService } from '../pallet.service';
import { DialogPoComponent } from '../dialog-po/dialog-po.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';

@Component({
    selector: 'app-delivery-order-form-3',
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
        UploadFileComponent
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
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('btNg') btNg: any;
    @ViewChild('checkbox') checkbox: any;
    @ViewChild('checkboxtack') checkboxtack: any;
    @ViewChild('dt') dt: DataTableDirective;
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptions: any = {};
    form: FormGroup;
    type: string;
    isIndividual: boolean = true;
    hidePassword = true;
    hideConfirmPassword = true;
    store = [];
    product_types = [];
    transports = [];
    standard_size = [];
    tracking = [];
    on_services = [];
    product = [];
    Id:number;

    imageUrl: string;
    data: any;

    datarowtacking = [];
    datarowPo = [];

    constructor(
        private formBuilder: FormBuilder,
        public _service: PalletService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.type = this.activated.snapshot.data?.type;
        this.product_types = this.activated.snapshot.data.product_type?.data;
        this.transports = this.activated.snapshot.data.transports?.data;
        this.product = this.activated.snapshot.data.product?.data;
        this.form = this.formBuilder.group({
            code: [''],
            shipment: [''],
            product_type_id: [''],
            tracking_number: [''],
            received_date: [new Date()],
            shipped_by: [''],
            remark: [''],
            delivery_order_lists: this.formBuilder.array([]),
        });
        this.filterForm = this.formBuilder.group({
            member_id: [''],
            in_store: [''],
            sack_code: [''],
        });
        if(this.type === 'EDIT'){
            this.Id = this.activated.snapshot.params.id;
            this.data = this.activated.snapshot.data.data?.data;
            this.form.patchValue({
                ...this.data,
                received_date: new Date(this.data.received_date),
            });

            // Patch delivery_order_lists
            const deliveryOrderLists = this.data.pallet_lists.map(order => ({
                delivery_order_id: order.delivery_order_id ,
                delivery_order_list_id: order.delivery_order_list_id,
                //==============
                customer: order.delivery_order_list?.member_id ?? '-',
                id: order.id ?? '-',
                sack_code: order.sack_id ?? '-',
                barcode: order.delivery_order_list?.barcode?? '-' ,
                in_store_code: order.delivery_order_list?.code ?? '-',
                shipment: '-',
                quantity_check: '-',
                parcel_type: '-',
                weight: order.delivery_order_list?.weight ?? 0,
                cbm: order.delivery_order_list?.cbm ?? 0,
                IsChecked: false,
            }));

            const listArray = this.form.get('delivery_order_lists') as FormArray;
            deliveryOrderLists.forEach(item => listArray.push(this.formBuilder.group(item)));
            this.lists = listArray.value;
        }
    }
    get listArray(): FormArray {
        return this.form.get('delivery_order_lists') as FormArray;
    }
    createListItem(): FormGroup {
        return this.formBuilder.group({
            delivery_order_id: [''],
            delivery_order_list_id: [''],
            //==============
            id: [''],
            customer: [''],
            sack_code: [''],
            barcode: [''],
            in_store_code: [''],
            quantity_check: [''],
            parcel_type: [''],
            weight: [''],
            cbm: [''],
            shipment: [''],
            IsChecked: [false],
        });
    }

    ngOnInit(): void {
        // setTimeout(() => this.loadTable());
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

    Submit() {
        if (this.form.invalid) {
            console.log('form', this.form.value);
            this.form.markAllAsTouched();
            return;
        }

        // Format the date before submitting
        const formValue = { ...this.form.value };
        formValue.received_date = new Date(formValue.received_date).toISOString().split('T')[0];

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
                if (this.type === 'NEW') {
                    console.log('form', payload);
                    this._service.create(payload).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('บันทึกข้อมูลสำเร็จ');
                            this._router.navigate(['pallet']);
                        },
                        error: (err) => {
                            this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                        },
                    });
                } else {
                    this._service.update(payload, this.Id).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('แก้ไขข้อมูลสำเร็จ');
                            this._router.navigate(['pallet']);
                        },
                        error: (err) => {
                            this.toastr.error('แก้ไขข้อมูลไม่สำเร็จ');
                        },
                    });
                }
            }
        });
    }

    Close() {
        this._router.navigate(['pallet']);
    }

    // loadTable(): void {
    //     this.dtOptions = {
    //         pagingType: 'full_numbers',
    //         serverSide: true,
    //         ajax: (dataTablesParameters: any, callback) => {
    //             this._service
    //                 .datatable(dataTablesParameters)
    //                 .pipe(map((resp: { data: any }) => resp.data))
    //                 .subscribe({
    //                     next: (resp: any) => {
    //                         console.log('resp', resp);
    //                         this.datarowtacking = resp.data;
    //                         callback({
    //                             recordsTotal: resp.total,
    //                             recordsFiltered: resp.total,
    //                             data: resp.data,
    //                         });
    //                     },
    //                 });
    //         },
    //         columns: [
    //             {
    //                 title: '',
    //                 data: null,
    //                 defaultContent: '',
    //                 ngTemplateRef: {
    //                     ref: this.checkboxtack,
    //                 },
    //                 className: 'w-10 text-center',
    //             },
    //             {
    //                 title: '#',
    //                 data: 'No',
    //                 className: 'w-10 text-center',
    //             },
    //             {
    //                 title: 'วันที่สร้าง',
    //                 data: 'date',
    //                 className: 'text-center',
    //                 // ngTemplateRef: {
    //                 //     ref: this.date,
    //                 // },
    //             },
    //             {
    //                 title: 'Tracking / เลขพัสดุ',
    //                 data: 'track_no',
    //                 className: 'text-center',
    //             },
    //         ],
    //     };
    // }
    selectAll: boolean = false;

    someSelect(): boolean {
        if (this.lists == null) {
            return false;
        }
        return this.lists.filter(t => t.IsChecked).length > 0 && !this.selectAll;
    }

    clearSelection() {
        this.lists.forEach(item => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.lists.forEach((item) => (item.IsChecked = this.selectAll));
    }

    updateAllselect() {
        this.selectAll = this.lists != null && this.lists.every(t => t.IsChecked);
        const listArray = this.listArray;
        this.lists.forEach((item, index) => {
            listArray.at(index).get('IsChecked').setValue(item.IsChecked);
        });
        console.log(this.lists, 'list');

    }
    get seletedList() {
        return this.lists != null && this.lists.filter(t => t.IsChecked).map(e => e.id);
    }

    clickRemove() {
        const confirmation = this.fuseConfirmationService.open({
            title: 'คุณแน่ใจหรือไม่ว่าต้องการนำรายการออก',
            message:
                'คุณกำลังนำรายการออก กรุณายืนยันเพื่อดำเนินการต่อ',
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
            if (result == 'confirmed') {
                this.lists = this.lists.filter(item => !item.IsChecked);
                const listArray = this.listArray
                for (let i = listArray.length - 1; i >= 0; i--) {
                    if (listArray.at(i).get('IsChecked').value) {
                        listArray.removeAt(i);
                    }
                }
            }
        });
    }
    lists = [];
    opendialoglist() {
        const DialogRef = this.dialog.open(DialogPoComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: '',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const listArray = this.listArray;
                const existingIds = listArray.value.map(item => item.delivery_order_list_id);
                const duplicateCodes = [];
                result.forEach((item: any) => {
                    if (existingIds.includes(item.id)) {
                        duplicateCodes.push(item?.delivery_order?.code);
                    } else {
                        const listItem = this.createListItem();
                        listItem.patchValue({
                            delivery_order_id: item.delivery_order_id,
                            delivery_order_list_id: item.id,
                            //==============
                            customer: '-',
                            id: item.id,
                            sack_code: item.sack?.code ?? '-',
                            barcode: item.barcode ?? '-',
                            in_store_code: item.delivery_order?.code ?? '-',
                            shipment: item.shipment ?? '-',
                            quantity_check: item.quantity_check ?? '-',
                            parcel_type: item.product_type?.name ?? '-',
                            weight: item.weight ?? 0,
                            cbm: item.cbm ?? 0,
                        });
                        listArray.push(listItem);
                    }
                });
                this.lists = listArray.value;
                if (duplicateCodes.length > 0) {
                    this.toastr.warning(`มีสินค้าอยู่ในพาเลทแล้ว: ${duplicateCodes.join(', ')}`);
                }
            }
        });
    }
    opendialogScan() {
        const DialogRef = this.dialog.open(DialogScanComponent, {
            disableClose: true,
            width: '40%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                value: this.product
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const listArray = this.listArray;
                const existingIds = listArray.value.map(item => item.delivery_order_list_id);
                if (existingIds.includes(result.id)) {
                    this.toastr.warning(`มีสินค้าอยู่ในพาเลทแล้ว: ${result.delivery_order?.code}`);
                } else {
                    const listItem = this.createListItem();
                    listItem.patchValue({
                        delivery_order_id: result.delivery_order_id,
                        delivery_order_list_id: result.id,
                        //==============
                        customer: '-',
                        id: result.id,
                        sack_code: result.sack?.code ?? '-',
                        barcode: result.barcode ?? '-',
                        in_store_code: result.delivery_order?.code ?? '-',
                        shipment: result.shipment ?? '-',
                        quantity_check: result.quantity_check ?? '-',
                        parcel_type: result.product_type?.name ?? '-',
                        weight: result.weight ?? 0,
                        cbm: result.cbm ?? 0,
                    });
                    listArray.push(listItem);
                    this.lists = listArray.value;
                    console.log(this.lists, 'lists');
                }
            }
        });
    }

    filterForm: FormGroup;
    showFilterForm: boolean = false;
    openfillter() {
        this.showFilterForm = !this.showFilterForm;
    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        console.log(filterValues);
    }
    clearFilter() {
        this.filterForm.reset();
    }
    selectMember(event: any) {
        this.filterForm.patchValue({
            member_id: event.id,
        });
    }

    get totallist() {
        return this.form.get('delivery_order_lists').value.length;
    }
    get totalWeight() {
        return this.form.get('delivery_order_lists').value
            .reduce((total, item) => total + Number(item.weight), 0)
            .toFixed(2);
    }
    get totalCBM() {
        return this.form.get('delivery_order_lists').value
            .reduce((total, item) => total + Number(item.cbm), 0)
            .toFixed(2);
    }
}
