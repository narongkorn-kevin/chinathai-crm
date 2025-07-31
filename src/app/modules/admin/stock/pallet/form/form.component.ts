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

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { calculateCBM } from 'app/helper';
import { DialogItemNonePalletSackComponent } from '../dialog-po-box/dialog-item-none-pallet-sack.component';
import { ScanBarcodeComponent } from 'app/modules/shared/scan-barcode.component';

@Component({
    selector: 'app-delivery-order-form-3',
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

    members: any[] = [];
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
    Id: number;

    imageUrl: string;
    lastCode: string = ''
    data: any;

    datarowtacking = [];
    datarowPo = [];
    showScanbarCode: boolean = false;

    constructor(
        private translocoService: TranslocoService,
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
        this._service.getMember().subscribe((resp: any) => {
            this.members = resp.data;
        })
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
        if (this.type === 'EDIT') {
            this.Id = this.activated.snapshot.params.id;
            this.data = this.activated.snapshot.data.data?.data;
            this.form.patchValue({
                ...this.data,
                received_date: new Date(this.data.received_date),
            });

            // Patch delivery_order_lists
            const deliveryOrderLists = this.data.pallet_lists.map((order) => ({
                delivery_order_list_item_id:order.delivery_order_list_items.id,
                member_code:order?.delivery_order?.member?.code,
                importer_code: order?.delivery_order?.member?.importer_code,
                delivery_order_id: order.delivery_order_id,
                delivery_order_list_id: order.delivery_order_list_id,
                delivery_order: order.delivery_order,
                id: order.id,
                sack_code: order.sack_id,
                barcode: order.delivery_order_list_items?.barcode,
                in_store_code: order.delivery_order.po_no,
                shipment: this.getShipmentMethod(order?.delivery_order?.shipment_by),
                quantity_check: order?.delivery_order_list?.qty_box,
                product_type: this.convertProductType(order.delivery_order?.product_type_id,),
                weight: order.delivery_order_list?.weight ?? 0,
                cbm: this.rowCBM(order.delivery_order_list),
                IsChecked: false,
            }));
            const listArray = this.form.get(
                'delivery_order_lists'
            ) as FormArray;
            deliveryOrderLists.forEach((item) =>
                listArray.push(this.formBuilder.group(item))
            );
            this.lists = listArray.value;
            console.log(this.lists);
            


        }
    }
    get listArray(): FormArray {
        return this.form.get('delivery_order_lists') as FormArray;
    }
    createListItem(): FormGroup {
        return this.formBuilder.group({
            delivery_order_list_item_id: '',
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
        if (this.type !== 'EDIT') {
            this._service.getCode().subscribe((resp: any) => {
                this.lastCode = resp.last_code
                this.form.patchValue({
                    code: this.lastCode,
                })
            })
        }
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
        formValue.received_date = new Date(formValue.received_date)
            .toISOString()
            .split('T')[0];

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
                    // console.log('form', payload);
                    this._service.create(payload).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate(
                                    'toastr.success'
                                )
                            );
                            this._router.navigate(['pallet']);
                        },
                        error: (err) => {
                            this.toastr.error(
                                this.translocoService.translate('toastr.error')
                            );
                        },
                    });
                } else {
                    this._service.update(payload, this.Id).subscribe({
                        next: (resp: any) => {
                            this.toastr.success(
                                this.translocoService.translate('toastr.edit')
                            );
                            this._router.navigate(['pallet']);
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
        this._router.navigate(['pallet']);
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
        // console.log(this.lists, 'list');
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
            message: this.translocoService.translate('confirmation.remove_message'),
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
                const listArray = this.listArray;
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
        
        const DialogRef = this.dialog.open(DialogItemNonePalletSackComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: '',
                value: this.form.value
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.addToPallet(result);
            }
        });
    }

    private addToPallet(result: any[]) {
        const listArray = this.listArray;
        const existingIds = listArray.value.map((item) => item.delivery_order_list_item_id);
        const duplicateCodes = [];
        result.forEach((item: any) => {
            if (existingIds.includes(item.id)) {
                duplicateCodes.push(item?.delivery_order?.po_no);
            } else {
                const listItem = this.formBuilder.group({
                    delivery_order_id: item.delivery_order.id,
                    delivery_order_list_id: item.delivery_order_list.id,
                    importer_code: this.findMemberName(item.delivery_order?.member_id),
                    delivery_order_list: item,
                    delivery_order_list_item_id: item.id,
                    //==============
                    sack_code: item.sack?.code,
                    barcode: item.barcode,
                    in_store_code: item.delivery_order?.po_no,
                    shipment: this.getShipmentMethod(item.delivery_order?.shipment_by),
                    product_type_id: item.product_type_id,
                    quantity_check: 1,
                    product_type: this.convertProductType(item.delivery_order.product_type_id),
                    weight: item.delivery_order_list.weight ?? 0,
                    cbm: calculateCBM(item.delivery_order_list.width, item.delivery_order_list.long, item.delivery_order_list.height, 1),
                });
                listArray.push(listItem);
                this.lists = [];
                this.lists = listArray.value;
            }
        });
        this.lists = listArray.value;
        if (duplicateCodes.length > 0) {
            this.toastr.warning(
                `มีสินค้าอยู่ในพาเลทแล้ว: ${duplicateCodes.join(', ')}`
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
                const listArray = this.listArray;
                const existingIds = listArray.value.map(
                    (item) => item.delivery_order_list_id
                );
                if (existingIds.includes(result.id)) {
                    this.toastr.warning(
                        `มีสินค้าอยู่ในพาเลทแล้ว: ${result.delivery_order?.po_no}`
                    );
                } else {

                    // const listItem = this.createListItem();
                    const listItem = this.formBuilder.group({
                        delivery_order_id: result.delivery_order_id,
                        delivery_order_list_id: result.id,
                        importer_code: result.delivery_order?.member?.importer_code,
                        delivery_order_list: result,

                        //==============
                        customer: '-',
                        id: result.id,
                        sack_code: result.sack?.code,
                        barcode: result.barcode,
                        in_store_code: result.delivery_order?.po_no,
                        shipment: this.getShipmentMethod(result.delivery_order?.shipment_by),
                        product_type_id: result.product_type_id,
                        quantity_check: 1,
                        product_type: this.convertProductType(result.product_type_id),
                        weight: result.weight ?? 0,
                        // cbm: result.cbm_per_unit ?? 0,
                        cbm: calculateCBM(result.width, result.long, result.height, 1),
                    })
                    listArray.push(listItem);
                    this.lists = []
                    this.lists = listArray.value;
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
        // console.log(filterValues);
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
            return total + weight;
        }, 0).toFixed(4);
    }




    get totalCBM() {
        return this.lists.reduce((total, item) => total + Number(item.cbm), 0)
            .toFixed(4);
    }



    convertProductType(data: any) {
        const productType = this.product_types.find(
            (type) => type.id === data
        );
        return productType ? productType.name : '';
    }

    rowCBM(data: any) {
        return calculateCBM(data.width, data.long, data.height, 1);
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
        console.log('searchCode', code);
        
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
                    this.addToPallet(data);
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
