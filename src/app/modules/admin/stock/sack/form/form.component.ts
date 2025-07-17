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
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { SackService } from '../sack.service';
import { DialogPoComponent } from '../dialog-po/dialog-po.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { last } from 'lodash';
import { calculateCBM } from 'app/helper';
import { DialogItemNonePalletSackComponent } from '../../pallet/dialog-po-box/dialog-item-none-pallet-sack.component';
import { ScanBarcodeComponent } from 'app/modules/shared/scan-barcode.component';

@Component({
    selector: 'app-delivery-order-form-4',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
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
        ScanBarcodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe],
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
    errorAudio = new Audio('assets/sounds/error.mp3');
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

    imageUrl: string;
    data: any;

    datarowtacking = [];
    datarowPo = [];
    members: any[] = [];
    lists = [];
    Id: number;
    lastCode: string = ''
    showScanbarCode: boolean = false;

    constructor(
        private translocoService: TranslocoService,
        private formBuilder: FormBuilder,
        public _service: SackService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private datePipe: DatePipe,
    ) {
        this._service.getMember().subscribe((resp: any) => {
            this.members = resp.data;
        })
        this.type = this.activated.snapshot.data?.type;
        this.product_types = this.activated.snapshot.data.product_type?.data;
        this.product = this.activated.snapshot.data.product?.data;
        this.transports = this.activated.snapshot.data.transports?.data;
        this.form = this.formBuilder.group({
            code: [''],
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
        if (this.type === 'EDIT') {
            this.Id = this.activated.snapshot.params.id;
            this.data = this.activated.snapshot.data.data.data;
            this.form.patchValue({
                ...this.data,
                received_date: new Date(this.data.received_date),
            });

            // Patch delivery_order_lists
            const deliveryOrderLists = this.data.sack_lists.map(
                (order) => ({
                    importer_code: order?.delivery_order?.member?.importer_code,
                    delivery_order_id: order.delivery_order_id,
                    delivery_order_list_id: order.delivery_order_list_id,
                    delivery_order: order.delivery_order,
                    delivery_order_list_item_id: order.delivery_order_list_item_id,
                    id: order.id,
                    sack_code: order.sack_id,
                    barcode: order.delivery_order_list_items?.barcode,
                    in_store_code: order.delivery_order?.po_no,
                    shipment: this.getShipmentMethod(order?.delivery_order?.shipment_by),
                    quantity_check: 1,
                    product_type: this.convertProductType(order.delivery_order?.product_type_id,),
                    weight: order.delivery_order_list?.weight ?? 0,
                    cbm: calculateCBM(order.delivery_order_list.width, order.delivery_order_list.long, order.delivery_order_list.height, 1),
                    IsChecked: false,
                })
            );

            const listArray = this.form.get(
                'delivery_order_lists'
            ) as FormArray;
            deliveryOrderLists.forEach((item) =>
                listArray.push(this.formBuilder.group(item))
            );
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
            delivery_order_list_item_id: [''],
            //==============
            id: [''],
            customer: [''],
            barcode: [''],
            in_store_code: [''],
            shipment: [''],
            quantity_check: [''],
            parcel_type: [''],
            weight: [''],
            cbm: [''],
            IsChecked: [false],
        });
    }

    ngOnInit(): void {
        if (this.type !== 'EDIT') {
            this._service.getCode().subscribe((resp: any) => {
                this.lastCode = resp.last_code
                this.form.patchValue({
                    code: this.lastCode,
                })
            })
        }
        this.form.valueChanges.subscribe((value) => {
            // console.log(this.form.value, 'form');
        });
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
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }

        // Format the date before submitting
        const formValue = { ...this.form.value };
        formValue.received_date = this.formatDate(formValue.received_date);
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.save_title'),
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
                const payload = { ...formValue };
                if (this.type === 'NEW') {
                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.success'
                                )
                            );
                            this._router.navigate(['sack']);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.error')
                            );
                        },
                    });
                } else {
                    this._service.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.edit')
                            );
                            this._router.navigate(['sack']);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate(
                                    'toastr.edit_error'
                                )
                            );
                        },
                    });
                }
            }
        });
    }

    Close() {
        this._router.navigate(['sack']);
    }

    selectAll: boolean = false;

    someSelect(): boolean {
        if (this.lists == null) {
            return false;
        }
        return (
            this.lists.filter((t) => t.IsChecked).length > 0 && !this.selectAll
        );
    }

    clearSelection() {
        this.lists.forEach((item) => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.lists.forEach((item) => (item.IsChecked = this.selectAll));
    }

    updateAllselect() {
        this.selectAll =
            this.lists != null && this.lists.every((t) => t.IsChecked);
        const listArray = this.listArray;
        this.lists.forEach((item, index) => {
            listArray.at(index).get('IsChecked').setValue(item.IsChecked);
        });
    }
    get seletedList() {
        return (
            this.lists != null &&
            this.lists.filter((t) => t.IsChecked).map((e) => e.id)
        );
    }

    clickRemove() {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate('confirmation.remove_title'),
            message: this.translocoService.translate(
                'confirmation.remove_message'
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
                this.lists = this.lists.filter((item) => !item.IsChecked);
                // const listArray = this.form.get('delivery_order_lists') as FormArray;
                const listArray = this.listArray;
                for (let i = listArray.length - 1; i >= 0; i--) {
                    if (listArray.at(i).get('IsChecked').value) {
                        listArray.removeAt(i);
                    }
                }
            }
        });
    }

    opendialoglist() {
        const DialogRef = this.dialog.open(DialogItemNonePalletSackComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: '',
                value: this.form.value,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.addToSack(result);
            }
        });
    }

    private addToSack(result: any[]) {
        console.log(result, 'result');
        const listArray = this.listArray;
        console.log(listArray, 'listArray');
        
        const existingIds = listArray.value.map(
            (item) => item.delivery_order_list_item_id
        );
        console.log(existingIds, 'existingIds');
        const duplicateCodes = [];

        result.forEach((item: any) => {
            if (existingIds.includes(item.id)) {
                duplicateCodes.push(item?.delivery_order?.po_no);
            } else {
                const listItem = this.formBuilder.group({
                    delivery_order_id: item.delivery_order_id,
                    delivery_order_list_id: item.delivery_order_list.id,
                    importer_code: this.findMemberName(item.delivery_order?.member_id),
                    delivery_order_list_item_id: item.id,
                    barcode: item.barcode,
                    in_store_code: item.delivery_order?.po_no,
                    shipment: this.getShipmentMethod(item.delivery_order?.shipment_by),
                    product_type_id: item.product_type_id,
                    quantity_check: 1,
                    product_type: this.convertProductType(item.delivery_order.product_type_id),
                    weight: item.delivery_order_list.weight ?? 0,
                    cbm: calculateCBM(
                        item.delivery_order_list.width,
                        item.delivery_order_list.long,
                        item.delivery_order_list.height,
                        1
                    ),
                });
                listArray.push(listItem);
            }
        });

        // update this.lists เฉพาะเมื่อมีรายการใหม่
        if (result.some(item => !existingIds.includes(item.id))) {
            this.lists = listArray.value;
        }

        // แสดง warning หากมีซ้ำ
        if (duplicateCodes.length > 0) {
            this.toastr.warning(
                `มีสินค้าอยู่ในกระสอบแล้ว: ${duplicateCodes.join(', ')}`
            );
        }
    }


    opendialogScan() {
        const DialogRef = this.dialog.open(DialogScanComponent, {
            disableClose: true,
            width: '40%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                value: this.product,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.addToSack(result);
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
        return this.lists.reduce((total, item) => {
            const weight = Number(item.weight) || 0;
            const qty = Number(item.quantity_check) || 0;
            return total + (weight * qty);
        }, 0).toFixed(4);
    }

    get totalCBM() {
        return this.form
            .get('delivery_order_lists')
            .value.reduce((total, item) => total + Number(item.cbm), 0)
            .toFixed(4);
    }
    formatDate(date: Date): string {
        // กำหนด timezone เป็น 'Asia/Bangkok' หรือ timezone ที่ต้องการ
        return this.datePipe.transform(date, 'yyyy-MM-dd', 'Asia/Bangkok');
    }


    convertProductType(data: any) {
        const productType = this.product_types.find(
            (type) => type.id === data
        );
        return productType ? productType.name : '';
    }

    rowCBM(data: any) {

        const { width, long, height, qty } = data;
        if (width && long && height && qty) {
            const cbm = (width * long * height) / 1_000_000;
            return parseFloat((cbm * qty).toFixed(4));
        }
        return 0;
    }

    getShipmentMethod(shippedBy: string): string {
        if (shippedBy === 'Car' || shippedBy === 'car') {
            return 'ขนส่งทางรถ';
        } else if (shippedBy === 'Ship' || shippedBy === 'ship') {
            return 'ขนส่งทางเรือ';
        } else if (shippedBy === 'Train' || shippedBy === 'train') {
            return 'ขนส่งทางรถไฟ';
        } else {
            return '-';
        }
    }

    findMemberName(memberId: any): string {
        const member = this.members.find((m) => m.id === +memberId);
        return member ? member.importer_code : '-';
    }

    codeScaned(code: string) {
        this.searchCode(code);
    }

    searchCode(code: string) {
        const body = {
            columns: [],
            order: [{ column: 0, dir: 'asc' }],
            start: 0,
            length: 1,
            search: { value: code.trim(), regex: false },
        };

        this._service
            .datatableorderlistBox(body)
            .subscribe((resp: any) => {
                if (resp?.data?.data.length > 0) {
                    const data = resp.data.data;
                    this.addToSack(data);
                } else {
                    this.toastr.error('Not Found');
                    this.errorAudio.currentTime = 0;
                    this.errorAudio.play().catch((e) => {
                        console.warn('Error sound failed to play', e);
                    });
                }
            });
    }
}
