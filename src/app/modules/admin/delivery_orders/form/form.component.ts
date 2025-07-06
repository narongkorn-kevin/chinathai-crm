import { UtilityService } from './../../../../utility.service';
import { values } from 'lodash';
import { data } from 'jquery';
import { map, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
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
import { DialogStockInComponent } from '../../dialog/dialog-stock-in/dialog.component';
import { DialogTrackingComponent } from '../../dialog/dialog-tracking/dialog.component';
import { MatTableModule } from '@angular/material/table';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogProductWaitComponent } from '../../dialog/dialog-product-wait/dialog.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogImageComponent } from '../dialog-image/dialog-image.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'app-delivery-order-form-1',
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    standalone: true,
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
        SelectMemberComponent,
        MatAutocompleteModule,
    ],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class FormComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    @ViewChild('btNg') btNg: any;
    @ViewChild('checkboxpo') checkboxpo: any;
    @ViewChild('checkboxtack') checkboxtack: any;
    @ViewChild('dtTacking') dtTacking: DataTableDirective;
    @ViewChild('dtPO') dtPO: DataTableDirective;
    dtTriggertack: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtTriggerpo: Subject<ADTSettings> = new Subject<ADTSettings>();
    dtOptionstack: any = {};
    dtOptionspo: any = {};
    form: FormGroup;
    type: string;
    isIndividual: boolean = true;
    hidePassword = true;
    hideConfirmPassword = true;
    store = [];
    product_type = [];
    unit = [];
    standard_size = [];
    tracking = [];
    on_services = [];

    imageUrl: string;
    data: any;

    datarowtacking = [];
    datarowPo = [];
    Id:number;

    ordersFilter = new FormControl('');
    filterorders: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    orders: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        public _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private locationService: LocationService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private utilityService: UtilityService
    ) {
        this.type = this.activated.snapshot.data?.type;
        this.store = this.activated.snapshot.data.store?.data;
        this.product_type = this.activated.snapshot.data.product_type?.data;
        this.standard_size = this.activated.snapshot.data.standard_size?.data;
        this.unit = this.activated.snapshot.data.unit?.data;
        this.on_services = this.activated.snapshot.data.on_services?.data;
        this.orders = this.activated.snapshot.data.order?.data;
        this.tracking = this.activated.snapshot.data.tracking?.data;
        this.data = this.activated.snapshot.data.data?.data;
        this.Id = this.activated.snapshot.params.id;
        this.filterorders.next(this.orders.slice());
    }

    protected _onDestroy = new Subject<void>();

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            order_id: [''],
            date: [new Date(), Validators.required],
            track_no: ['', Validators.required],
            driver_name: ['', Validators.required],
            driver_phone: ['', Validators.required],
            note: [''],
            status: [''],
            member_id: ['', Validators.required],
            tracks: this.formBuilder.array([]),
            shipping_china:[''],
            shipment_by:[''],
            add_on_services: this.formBuilder.array(this.on_services && Array.isArray(this.on_services)
                    ? this.on_services.map((service) =>
                        this.createaddOnServices(service)
                    ) : []
            ),
            //===== ค้นหา =====
            name: [''],
        });

        if (this.type === 'EDIT') {
            this.form.patchValue({
                order_id: this.data.order_id,
                date: new Date(this.data.date),
                track_no: this.data.code,
                driver_name: this.data.driver_name,
                driver_phone: this.data.driver_phone,
                note: this.data.note,
                status: this.data.status,
                member_id: this.data.member_id,
            });

            // Patch tracks
            this.data.delivery_order_tracks.forEach((track) => {
                const trackForm = this.createTrack({
                    track_id: track.track_id,
                    track_no: track.track_no,
                    date: track.date,
                });

                // Patch lists
                track.delivery_order_lists.forEach((list) => {
                    const productForm = this.createProduct({
                        product_draft_id: list.product_draft_id,
                        product_type_id: list.product_type_id,
                        product_name: list.product_name,
                        product_image: list.product_image,
                        standard_size_id: list.standard_size_id,
                        unit_id: list.unit_id,
                        weight: list.weight,
                        width: list.width,
                        height: list.height,
                        long: list.long,
                        qty: list.qty,
                        qty_box: list.qty_box,
                        cbm: list.cbm,
                        images: list.images,
                    });
                    (trackForm.get('lists') as FormArray).push(productForm);
                });

                this.tracksArray.push(trackForm);
            });

            const addOnServicesArray = this.data.delivery_order_add_on_services.map((service) =>
                this.createaddOnServices({
                    id: service.add_on_service_id,
                    price: service.price,
                    name: service.add_on_service?.name,
                })
            );
            this.form.setControl('add_on_services', this.formBuilder.array(addOnServicesArray));
            console.log('form', this.form.value);

        }
        // setTimeout(() => this.loadTable());

        this.ordersFilter.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this._filterorder();
        });
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTriggertack.next(this.dtOptionstack);
            this.dtTriggerpo.next(this.dtOptionspo);
        }, 200);
    }
    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTriggertack.unsubscribe();
        this.dtTriggerpo.unsubscribe();
        // Also destroy the DataTable instances
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTriggerpo.next(this.dtOptionspo);
            this.dtTriggertack.next(this.dtOptionstack);
        });
    }
    get tracksArray(): FormArray {
        return this.form.get('tracks') as FormArray;
    }
    get add_on_servicesArray(): FormArray {
        return this.form.get('add_on_services') as FormArray;
    }
    createTrack(data?: any): FormGroup {
        return this.formBuilder.group({
            track_id: [data?.track_id || ''],
            track_no: [data?.track_no || ''],
            date: [data?.date || ''],
            lists: this.formBuilder.array(
                data?.lists && Array.isArray(data.lists)
                    ? data.lists.map((list) => this.createProduct(list))
                    : []
            ),
            IsChecked: [false],
        });
    }
    removetrack(index: number): void {
        this.tracksArray.removeAt(index);
    }

    index_track: number;
    get listsArray(): FormArray {
        if (this.index_track === undefined) {
            return this.formBuilder.array([]);
        }
        return this.tracksArray.at(this.index_track).get('lists') as FormArray;
    }
    removelist(index: number): void {
        this.listsArray.removeAt(index);
    }

    createProduct(data?: any): FormGroup {
        return this.formBuilder.group({
            product_type_id: [data?.product_type_id || ''],
            product_type: [data?.product_type?.name || ''],
            product_draft_id: [data?.product_draft_id || ''],
            product_name: [data?.product_name || ''],
            product_image: [data?.product_image || ''],
            product_logo: [data?.product_logo || ''],
            standard_size_id: [data?.standard_size_id || ''],
            standard_size: [data?.standard_size?.name || ''],
            unit_id: [data?.unit_id || ''],
            unit: [data?.unit?.name || ''],
            weight: [data?.weight || ''],
            width: [data?.width || ''],
            height: [data?.height || ''],
            long: [data?.long || ''],
            qty: [data?.qty || ''],
            qty_box: [data?.qty_box || ''],
            cbm: [data?.cbm || ''],
            images: this.formBuilder.array(
                data?.images?.map((image) => this.createImage(image)) || []
            ),
            // images:data?.images ? this.createImage(data.images) : {},
            IsChecked: [false],
        });
    }

    createImage(data?: any): FormGroup {
        return this.formBuilder.group({
            image_url: [data?.image_url || ''],
            image: [data?.image || ''],
        });
    }

    createaddOnServices(data?: any): FormGroup {
        return this.formBuilder.group({
            add_on_service_id: [data?.id || '', Validators.required],
            price: [data?.price || 0],
            name: [data?.name || ''],
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
        formValue.date = new Date(formValue.date).toISOString().split('T')[0];

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

                if (this.type === 'NEW') {
                    formValue.status = 'arrived_china_warehouse';
                    console.log('form', formValue);
                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('บันทึกข้อมูลสำเร็จ');
                            this._router.navigate(['delivery_orders']);
                        },
                        error: (err) => {
                            this.toastr.error('บันทึกข้อมูลไม่สำเร็จ');
                        },
                    });
                } else {
                    this._service.update(this.Id,formValue).subscribe({
                        next: (resp: any) => {
                            this.toastr.success('แก้ไขข้อมูลสำเร็จ');
                            this._router.navigate(['delivery_orders']);
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
        this._router.navigate(['delivery_orders']);
    }

    openAddTacking() {
        const DialogRef = this.dialog.open(DialogTrackingComponent, {
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
                console.log(result, 'resulttack');
                const tracks = this.form.get('tracks') as FormArray;
                const existingTracks = [];
                const newTracks = [];

                if (Array.isArray(result)) {
                    result.forEach((track: any) => {
                        const existingTrack = tracks.controls.find(
                            (t) => t.value.track_id === track.id
                        );
                        if (existingTrack) {
                            existingTracks.push(track.track_no);
                        } else {
                            newTracks.push(track);
                        }
                    });
                } else {
                    const existingTrack = tracks.controls.find(
                        (t) => t.value.track_id === result.id
                    );
                    if (existingTrack) {
                        existingTracks.push(result.track_no);
                    } else {
                        newTracks.push(result);
                    }
                }

                if (existingTracks.length > 0) {
                    this.toastr.error(`มี track อยู่ใน PO แล้ว: ${existingTracks.join(', ')}`);
                }

                newTracks.forEach((track: any) => {
                    const trackForm = this.createTrack({
                        track_id: track.id,
                        track_no: track.track_no,
                        date: track.date,
                    });
                    tracks.push(trackForm);
                });
            }
        });
    }
    openAddimage() {
        const DialogRef = this.dialog.open(DialogScanComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                value: this.tracking,
                type: 'tracking',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const existingTrack = this.tracksArray.controls.find(
                    (track) => track.value.track_id === result.id
                );
                if (existingTrack) {
                    this.toastr.error('มี track อยู่ใน PO แล้ว');
                } else {
                    const trackForm = this.createTrack({
                        track_id: result.id,
                        track_no: result.code,
                        date: result.date,
                    });
                    this.tracksArray.push(trackForm);
                    this._changeDetectorRef.detectChanges();
                }
            }
        });
    }
    openAddProduct() {
        if (this.index_track === undefined) {
            this.toastr.error('กรุณาเลือก Tracking ก่อน');
            return;
        }
        const DialogRef = this.dialog.open(DialogStockInComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: '',
                product_type: this.product_type,
                standard_size: this.standard_size,
                unit: this.unit,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'resultpo');
                const track = this.tracksArray.at(this.index_track);
                if (track) {
                    const lists = track.get('lists') as FormArray;
                    const productForm = this.createProduct({
                        product_draft_id: result.id,
                        product_type_id: result.product_type_id,
                        product_type: result.product_type,
                        product_name: result.product_name,
                        product_image: result.product_logo,
                        standard_size_id: result.standard_size_id,
                        unit_id: result.unit_id,
                        weight: result.weight,
                        width: result.width,
                        height: result.height,
                        long: result.long,
                        qty: result.qty,
                        qty_box: result.qty_box,
                        cbm: result.cbm,
                        images: [
                            {
                                image_url: result.images.image_url,
                                image: this.getUrl(result.images.image),
                            },
                        ],
                    });
                    lists.push(productForm);
                }
            }
        });
    }
    openAddProductWait() {
        const DialogRef = this.dialog.open(DialogProductWaitComponent, {
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
                console.log(result, 'resulttack');
                const track = this.tracksArray.at(this.index_track);
                if (track) {
                    const lists = track.get('lists') as FormArray;
                    result.forEach((result: any) => {
                        const duplicateTrack = this.tracksArray.controls.find(track =>
                            (track.get('lists') as FormArray).controls.some(product =>
                                product.value.product_draft_id === result.id
                            )
                        );
                        if (duplicateTrack) {
                            const trackNo = duplicateTrack.get('track_no').value;
                            this.toastr.warning(`มีสินค้า: ${result.product_name} อยู่ใน track: ${trackNo}`);
                            return;
                        }
                        const productForm = this.createProduct({
                            ...result,
                            product_draft_id: result.id,
                        });
                        lists.push(productForm);
                        console.log(productForm, 'productForm');
                    });
                }
                console.log(this.form.value, 'form');
            }
        });
    }

    selectedTrack: any;
    selectTrack(track: any): void {
        this.index_track = this.tracksArray.controls.findIndex(
            (control) => control.value.track_id === track.value.track_id
        );
    }
    isSelectedTrack(track: any): boolean {
        return this.index_track !== undefined && this.tracksArray.at(this.index_track) === track;
    }
    get totallist() {
        return this.listsArray.length;
    }

    get totalBoxes() {
        return this.listsArray.controls.reduce((total, product) => total + Number((product.get('qty_box')?.value) || 0), 0).toFixed(2);
    }

    get totalUnits() {
        return this.listsArray.controls.reduce((total, product) => total + Number((product.get('qty')?.value) || 0), 0).toFixed(2);
    }

    get totalWeight() {
        return this.listsArray.controls.reduce((total, product) => total + Number((product.get('weight')?.value) || 0), 0).toFixed(2);
    }

    get totalCBM() {
        return this.listsArray.controls.reduce((total, product) => {
            const width = product.get('width')?.value || 0;
            const height = product.get('height')?.value || 0;
            const length = product.get('long')?.value || 0;
            return total + (width * height * length) / 1000000; // Convert cubic cm to cubic meters
        }, 0);
    }

    selectAll: boolean = false;

    someSelect(): boolean {
        if (this.tracksArray.controls == null) {
            return false;
        }
        return this.tracksArray.controls.some(track => track.get('IsChecked').value);
    }

    clearSelection() {
        this.tracksArray.controls.forEach(track => {
            track.get('IsChecked').setValue(false);
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.tracksArray.controls.forEach((track) => track.get('IsChecked').setValue(this.selectAll));
    }

    updateAllselect() {
        this.selectAll = this.tracksArray.controls != null && this.tracksArray.controls.every(track => track.get('IsChecked').value);
        this._changeDetectorRef.detectChanges(); // Trigger change detection
        console.log(this.tracksArray.controls, 'tracks');
    }

    get seletedList() {
        return this.tracksArray.controls != null && this.tracksArray.controls.filter(track => track.get('IsChecked').value).map(track => track.value.track_id);
    }

    removeSelectedTracks(): void {
        const confirmation = this.fuseConfirmationService.open({
            title: 'ยืนยันการนำข้อมูล tracking ออก',
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
                const selectedTracks = this.tracksArray.controls.filter(track => track.value.IsChecked);
                selectedTracks.forEach(track => {
                    const index = this.tracksArray.controls.indexOf(track);
                    if (index !== -1) {
                        this.removetrack(index);
                    }
                });
                this.updateAllselect();
            }
        });
    }

    selectAllProducts: boolean = false;

    someSelectProducts(): boolean {
        if (this.listsArray.controls == null) {
            return false;
        }
        return this.listsArray.controls.some(product => product.get('IsChecked').value);
    }

    clearProductSelection() {
        this.listsArray.controls.forEach(product => {
            product.get('IsChecked').setValue(false);
        });

        this.selectAllProducts = false;
    }

    SelectAllProducts(checked: boolean) {
        this.selectAllProducts = checked; // Set isSelectAll to true when selectAll is checked

        this.listsArray.controls.forEach((product) => product.get('IsChecked').setValue(this.selectAllProducts));
    }

    updateAllSelectProducts() {
        this.selectAllProducts = this.listsArray.controls != null && this.listsArray.controls.every(product => product.get('IsChecked').value);
        this._changeDetectorRef.detectChanges(); // Trigger change detection
        console.log(this.listsArray.controls, 'products');
    }

    get selectedProductList() {
        return this.listsArray.controls != null && this.listsArray.controls.filter(product => product.get('IsChecked').value).map(product => product.value.product_id);
    }

    removeSelectedProducts(): void {
        const confirmation = this.fuseConfirmationService.open({
            title: 'ยืนยันการนำข้อมูลผลิตภัณฑ์ออก',
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
                const selectedProducts = this.listsArray.controls.filter(product => product.value.IsChecked);
                selectedProducts.forEach(product => {
                    const index = this.listsArray.controls.indexOf(product);
                    if (index !== -1) {
                        this.removelist(index);
                    }
                });
                this.updateAllSelectProducts();
            }
        });
    }
    selectMember(event: any) {
        this.form.patchValue({
            member_id: event.id,
        });
    }
    getUrl(path: string): string {
        console.log('path',path);
        return this.utilityService.getFullUrl(path);
    }

    protected _filterorder() {
        if (!this.orders) {
            return;
        }
        let search = this.ordersFilter.value;
        // console.log(search, 's');

        if (!search) {
            this.filterorders.next(this.orders.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }

        // กรองข้อมูลโดยค้นหาใน firstname และ lastname
        this.filterorders.next(
            this.orders.filter(item =>
                // (item.firstname.toLowerCase() + ' ' + item.lastname.toLowerCase()).includes(search) ||
                // item.firstname.toLowerCase().includes(search) ||
                // item.lastname.toLowerCase().includes(search)
                (item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search) )
            )
        );
    }
    onSelectorder(event: any, type: any) {
        if (!event) {
            if (this.ordersFilter.invalid) {
                this.ordersFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            return;
        }

        const selectedData = event; // event จะเป็นออบเจ็กต์ item

        if (selectedData) {
            this.form.patchValue({
                order_id: selectedData.id,
            });
            this.ordersFilter.setValue(`${selectedData.code}`);
        } else {
            if (this.ordersFilter.invalid) {
                this.ordersFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No order Found');
            return;
        }
    }
}
