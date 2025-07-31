import {
    Component,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
    AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, ReplaySubject, takeUntil, of } from 'rxjs';

// Angular Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Services
import { DeliveryOrdersService } from '../delivery-orders.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from './../../../../utility.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

// Components
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ImageUploadComponent } from 'app/modules/common/image-upload/image-upload.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogScanComponent } from 'app/modules/common/dialog-scan/dialog-scan.component';
import { UppercaseEnglishDirective } from 'app/modules/common/uppercase-english/uppercase-english.component';

// Dialogs
import { DialogStockInComponent } from '../../dialog/dialog-stock-in/dialog.component';
import { DialogTrackingComponent } from '../../dialog/dialog-tracking/dialog.component';
import { DialogProductWaitComponent } from '../../dialog/dialog-product-wait/dialog.component';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DeliveryOrderList } from 'app/app.interface';
import { calculateCBM } from 'app/helper';
import { PictureComponent } from '../picture/picture.component';
import { PictureMultiComponent } from 'app/modules/shared/picture-multi/picture-multi.component';
import { ScanBarcodeComponent } from 'app/modules/shared/scan-barcode.component';
import { ScanBarcodeDialogComponent } from 'app/modules/shared/scan-barcode-dialog/scan-barcode-dialog.component';

@Component({
    selector: 'app-delivery-order-form',
    standalone: true,
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatIconModule,
        RouterLink,
        MatTableModule,
        MatMenuModule,
        MatDividerModule,
        SelectMemberComponent,
        MatAutocompleteModule,
        UppercaseEnglishDirective
    ],
})
export class FormComponent implements OnInit, AfterViewInit {
    // Form configuration
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    form: FormGroup;

    // Data properties
    type: string;
    store = [];
    product_type = [];
    unit = [];
    packing_type = [];
    standard_size = [];
    tracking = [];
    on_services = [];
    orders: any[] = [];
    data: any;
    Id: number;
    index_track: number;
    selectAll: boolean = false;
    selectAllProducts: boolean = false;
    lang: string;
    langues: string;
    imageLoadError = false;
    filteredTracks: any[] = [];
    // Form filtering
    ordersFilter = new FormControl('');
    filterorders: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    protected _onDestroy = new Subject<void>();
    delivery_orders: any[] = []
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;

    errorAudio = new Audio('assets/sounds/error.mp3');

    constructor(
        private formBuilder: FormBuilder,
        public _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private utilityService: UtilityService,
        private translocoService: TranslocoService
    ) {
        // Initialize from route data
        this.type = this.activated.snapshot.data?.type;
        this.store = this.activated.snapshot.data.store?.data || [];
        this.product_type =
            this.activated.snapshot.data.product_type?.data || [];
        this.standard_size =
            this.activated.snapshot.data.standard_size?.data || [];
        this.unit = this.activated.snapshot.data.unit?.data || [];
        this.packing_type =
            this.activated.snapshot.data.packing_type?.data || [];
        this.on_services = this.activated.snapshot.data.on_services?.data || [];
        this.orders = this.activated.snapshot.data.order?.data || [];
        this.tracking = this.activated.snapshot.data.tracking?.data || [];
        this.delivery_orders = this.activated.snapshot.data.delivery_orders?.data || [];
        this.data = this.activated.snapshot.data.data?.data;
        this.Id = this.activated.snapshot.params.id;

        // Set up filters
        this.filterorders.next(this.orders.slice());

        // Handle language
        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }

    ngOnInit(): void {
        this.initializeForm();

        if (this.type === 'EDIT') {
            this.patchFormWithData();
        }

        // Set up filtering for orders
        this.ordersFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => this._filterorder());

        this.form.get('order_id')?.valueChanges.subscribe((value) => {
            if (value) {
                this._service.getOrderById(value).subscribe((res: any) => {
                    if (res) {
                        setTimeout(() => {
                            this.processOrderAddOnServices(res.data);
                        }, 700);
                    }
                });
            }
        });

        this.form
            .get('name')
            ?.valueChanges.pipe(
                takeUntil(this._onDestroy),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                this.filterTracks(value);
            });
        if (!this.Id) {
            this.form.get('po_no')?.valueChanges
                .pipe(
                    debounceTime(1000),
                    distinctUntilChanged()
                )
                .subscribe((value) => {
                    const poControl = this.form.get('po_no');
                    if (!value || !poControl) return;

                    const found = this.delivery_orders.find(item => item.po_no === value);

                    if (found) {
                        this.toastr.error('หมายเลขนี้ถูกใช้ไปแล้ว ไม่สามารถใช้งานได้');
                        poControl.setErrors({ duplicate: true });
                    } else {
                        this.toastr.success('สามารถใช้งานหมายเลขนี้ได้');
                        if (poControl.hasError('duplicate')) {
                            const currentErrors = poControl.errors;
                            delete currentErrors['duplicate'];
                            if (Object.keys(currentErrors).length === 0) {
                                poControl.setErrors(null);
                            } else {
                                poControl.setErrors(currentErrors);
                            }
                        }
                    }
                });
        }

    }

    processOrderAddOnServices(orderData: any): void {
        if (!orderData || !orderData.order_lists) return;

        // Create a map to aggregate services by ID
        const servicesMap = new Map<number, number>(); // serviceId -> totalPrice

        // Process each order list
        orderData.order_lists.forEach((list) => {
            if (list.add_on_services && Array.isArray(list.add_on_services)) {
                // Process add-on services for each order list
                list.add_on_services.forEach((service) => {
                    const serviceId = service.add_on_service_id;
                    const servicePrice =
                        parseFloat(service.add_on_service_price) || 0;

                    // If service already exists in map, add to its price
                    if (servicesMap.has(serviceId)) {
                        servicesMap.set(
                            serviceId,
                            servicesMap.get(serviceId) + servicePrice
                        );
                    } else {
                        // Add new service to map
                        servicesMap.set(serviceId, servicePrice);
                    }
                });
            }
        });

        // Get current add_on_services FormArray
        const currentServices = this.add_on_servicesArray;

        // Update price values in existing FormArray
        for (let i = 0; i < currentServices.length; i++) {
            const service = currentServices.at(i);
            const serviceId = service.get('add_on_service_id').value;

            if (servicesMap.has(serviceId)) {
                service.get('price').setValue(servicesMap.get(serviceId));
            } else {
                // Reset price if not found in order data
                service.get('price').setValue(0);
            }
        }
    }

    ngAfterViewInit() {
        // No DataTable initialization needed in the refactored version
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    // Form initialization and access methods
    private initializeForm(): void {
        this.form = this.formBuilder.group({
            order_id: [''],
            date: [new Date(), Validators.required],
            po_no: ['', Validators.required],
            code: [],
            driver_name: [''],
            driver_phone: [''],
            note: [''],
            member_importer_code_id: [''],
            status: [''],
            member_id: [''],
            member: [''],
            tracks: this.formBuilder.array([]),
            shipment_china: [''],
            shipment_by: ['', Validators.required], // ✅ เพิ่ม required
            store_id: [''],
            product_type_id: ['', Validators.required], // ✅ เพิ่ม required
            add_on_services: this.formBuilder.array([]),
            name: [''], // For search functionality
        });
    }

    private patchFormWithData(): void {

        console.log(this.data, 'data');
        ''
        if (!this.data) return;
        // Patch basic form values
        this.form.patchValue({
            ...this.data,
            code: this.data?.code,
            order_id: this.data?.order?.id,
            store_id: this.data.store_id,
            driver_name: this.data.driver_name,
            driver_phone: this.data.driver_phone,
            note: this.data.note,
            status: this.data.status,
            member_id: this.data.member_id,
            member_importer_code_id: this.data?.member_importer?.id,
            product_type_id: this.data?.product_type_id,
        });
        this.ordersFilter.setValue(this.data?.order?.code);
        this.memberIdToEdit = this.data.member_id;
        this.agentToEdit = this.data?.member_importer?.id;

        // Patch tracks
        this.data.delivery_order_tracks?.forEach((track) => {
            const trackForm = this.createTrack({
                track_id: track.track_id,
                track_no: track.track_no,
                date: track.created_at,
                sum_cbm: track?.sum_cbm,
            });
            // ✅ เรียก selectTrack เฉพาะตอนเพิ่มตัวแรกเท่านั้น

            let sum_cbm = 0;
            // Patch products for each track
            track.delivery_order_lists?.forEach((list) => {
                console.log(list, 'list');
                const width = Number(list.width || 0);
                const height = Number(list.height || 0);
                const long = Number(list.long || 0); // ถ้ามีชื่ออื่นเช่น depth ให้ปรับ
                const qty_box = Number(list.qty_box || 0);

                const cbm = (width * height * long * 1) / 1000000; // m³
                sum_cbm += cbm;
                const productForm = this.createProduct({
                    id: list.id,
                    code: list?.code,
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
                    cbm: cbm,
                    images: list.images,

                    delivery_order_id: list.delivery_order_id,
                    delivery_order_tracking_id: list.delivery_order_tracking_id,
                });
                (trackForm.get('lists') as FormArray).push(productForm);
            });
            trackForm.patchValue({ sum_cbm }); // เพิ่ม field sum_cbm ใน FormGroup ด้วย
            this.tracksArray.push(trackForm);
            if (this.tracksArray.length === 1) {
                this.selectTrack(trackForm);
            }
        });
        console.log(this.form.value);

        // Patch additional services
        const addOnServicesArray =
            this.data.delivery_order_add_on_services?.map((service) =>
                this.createaddOnServices({
                    id: service.add_on_service_id,
                    price: service.price,
                    name: service.add_on_service?.name,
                })
            ) || [];

        this.form.setControl(
            'add_on_services',
            this.formBuilder.array(addOnServicesArray)
        );
    }

    // FormArray getters
    get tracksArray(): FormArray {
        return this.form.get('tracks') as FormArray;
    }

    get add_on_servicesArray(): FormArray {
        return this.form.get('add_on_services') as FormArray;
    }

    get listsArray(): FormArray {
        if (
            this.index_track === undefined ||
            this.index_track < 0 ||
            this.index_track >= this.tracksArray.length
        ) {
            return this.formBuilder.array([]);
        }
        return this.tracksArray.at(this.index_track).get('lists') as FormArray;
    }

    // Form group creation methods
    createTrack(data?: any): FormGroup {
        return this.formBuilder.group({
            track_id: [data?.track_id || ''],
            track_no: [data?.track_no || ''],
            date: [data?.date || ''],
            lists: this.formBuilder.array(
                data?.lists?.map((list) => this.createProduct(list)) || []
            ),
            IsChecked: [false],
            sum_cbm: [data?.sum_cbm || 0],
        });
    }

    createProduct(data?: any): FormGroup {
        return this.formBuilder.group({
            id: [data?.id || ''],
            code: [data?.code || ''],
            delivery_order_id: [data?.delivery_order_id || ''],
            delivery_order_tracking_id: [
                data?.delivery_order_tracking_id || '',
            ],
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

    // Form actions
    Submit(): void {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }

        // Format the date before submitting
        const formValue = { ...this.form.value };
        formValue.date = new Date(formValue.date).toISOString().split('T')[0];

        this.showConfirmationDialog(() => {
            if (this.type === 'NEW') {
                formValue.status = 'arrived_china_warehouse';
                this._service.create(formValue).subscribe({
                    next: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.success')
                        );
                        this._router.navigate(['delivery_orders']);
                    },
                    error: () => {
                        this.toastr.error(
                            this.translocoService.translate('toastr.error')
                        );
                    },
                });
            } else {
                this._service.update(this.Id, formValue).subscribe({
                    next: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.edit')
                        );
                        this._router.navigate(['delivery_orders']);
                    },
                    error: () => {
                        this.toastr.error(
                            this.translocoService.translate('toastr.edit_error')
                        );
                    },
                });
            }
        });
    }

    Close(): void {
        this._router.navigate(['delivery_orders']);
    }

    // Track selection methods
    selectTrack(track: any): void {
        // console.log('track =', track);
        const tracksArray = this.form.get('tracks') as FormArray;
        const targetTrackId =
            track instanceof FormGroup ? track.value.track_id : track.id;

        tracksArray.controls.forEach((control, index) => {
            console.log(`Control[${index}].track_id =`, control.value.track_id);
        });

        this.index_track = tracksArray.controls.findIndex(
            (control) => control.value.track_id == targetTrackId
        );
        // console.log('Resulting index_track =', this.index_track);
    }

    isSelectedTrack(track: any): boolean {
        // console.log('track =', this.index_track);
        return (
            this.index_track !== undefined &&
            this.tracksArray.at(this.index_track) === track
        );
    }

    // Dialog methods
    memberIdToEdit: number | null = null;
    agentToEdit: number | null = null;
    openAddTacking(): void {
        console.log(this.tracksArray.controls);
        const existingIds = this.tracksArray.controls.map(ctrl => ctrl.get('track_id')?.value);
        console.log(existingIds, 'track_id');

        const dialogRef = this.dialog.open(DialogTrackingComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: { type: '', selected: this.tracksArray.value, arrayTrack: existingIds },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;

            const tracks = this.tracksArray;
            const existingTracks: string[] = [];
            const newTracks: any[] = [];
            const tracksToSelect: any[] = [];

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

                    // เก็บรายการที่ต้อง select ทีหลัง (ทั้ง found และ new)
                    tracksToSelect.push(existingTrack ?? track);
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

                tracksToSelect.push(existingTrack ?? result);
            }

            // แสดง toastr หากมี track ซ้ำ
            if (existingTracks.length > 0) {
                this.toastr.error(`${this.translocoService.translate('toastr.track_in_po')}: ${existingTracks.join(', ')}`);
            }

            // push tracks ใหม่เข้า FormArray
            newTracks.forEach((track: any) => {
                console.log(track, 'track');

                if (track.member) {
                    this.form.patchValue({
                        member_id: track.member.id,
                        order_id: track.order.id,
                    });
                    this.ordersFilter.setValue(track.order.code);
                    this.memberIdToEdit = track.member.id;
                }

                if (!track.order) {
                    this.toastr.warning('ไม่พบข้อมูลคำสั่งซื้อในระบบ')
                }

                this.form.patchValue({
                    po_no: track.track_no
                })

                const trackForm = this.createTrack({
                    track_id: track.id,
                    track_no: track.track_no,
                    date: track.date,
                });
                tracks.push(trackForm);
            });

            // select หลังจาก push ครบ
            tracksToSelect.forEach((track: any) => {
                this.selectTrack(track);
            });
        });
    }

    openAddimage(): void {
        const dialogRef = this.dialog.open(DialogScanComponent, {
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

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;

            const existingTrack = this.tracksArray.controls.find(
                (track) => track.value.track_id === result.id
            );

            if (existingTrack) {
                this.toastr.error(
                    this.translocoService.translate('toastr.is_a_track')
                );
            } else {
                this._service.getTracking(result.id).subscribe((res: any) => {
                    if (res) {
                        // console.log(res);
                    }
                });
                const trackForm = this.createTrack({
                    track_id: result.id,
                    track_no: result.code,
                    date: result.date,
                });
                this.tracksArray.push(trackForm);
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    openAddProduct(): void {
        if (this.index_track === undefined) {
            this.toastr.error(
                this.translocoService.translate('toastr.select_tracking')
            );
            return;
        }

        const dialogRef = this.dialog.open(DialogStockInComponent, {
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
                packing_type: this.packing_type,
                product_type_id: this.form.value.product_type_id,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            console.log(result);
            const track = this.tracksArray.at(this.index_track);
            if (track) {
                const lists = track.get('lists') as FormArray;
                const productForm = this.createProduct({
                    product_draft_id: result?.data?.id,
                    product_type_id: result?.data?.product_type_id,
                    product_type: result?.data?.product_type,
                    product_name: result?.data?.product_name,
                    product_image: result?.data?.product_logo,
                    standard_size_id: result?.data?.standard_size_id,
                    unit_id: result?.data?.unit_id,
                    weight: result?.data?.weight,
                    width: result?.data?.width,
                    height: result?.data?.height,
                    long: result?.data?.long,
                    qty: result?.data?.qty,
                    qty_box: result?.data?.qty_box,
                    cbm: result?.data?.cbm,
                    images: Array.isArray(result?.data?.images)
                        ? result?.data?.images.map(img => ({
                            image_url: this.getUrl(img.image),
                            image: img.image_url,
                        }))
                        : [], // fallback ถ้าไม่มีภาพ
                });

                lists.push(productForm);
            }
            console.log(this.form.value);

        });
    }

    openEditProduct(data: any, productIndex: number): void {
        console.log(data);
        if (this.index_track === undefined) {
            this.toastr.error(
                this.translocoService.translate('toastr.select_tracking')
            );
            return;
        }

        const dialogRef = this.dialog.open(DialogStockInComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: 'EDIT',
                value: data,
                product_type: this.product_type,
                standard_size: this.standard_size,
                unit: this.unit,
                packing_type: this.packing_type,
                code: this.data?.code,
                po_no: this.data?.po_no,
                seq: productIndex,
                product_draft_id: data?.product_draft_id,
                images: data?.images,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;

            const track = this.tracksArray.at(this.index_track);
            if (track) {
                const lists = track.get('lists') as FormArray;
                const updatedProductForm = this.createProduct({
                    id: result?.data?.id,
                    product_draft_id: result?.data?.id,
                    product_type_id: result?.data?.product_type_id,
                    delivery_order_tracking_id: data.delivery_order_tracking_id,
                    product_type: result?.data?.product_type,
                    product_name: result?.data?.product_name,
                    product_image: result?.data?.product_logo,
                    standard_size_id: result?.data?.standard_size_id,
                    unit_id: result?.data?.unit_id,
                    weight: result?.data?.weight,
                    width: result?.data?.width,
                    height: result?.data?.height,
                    long: result?.data?.long,
                    qty: result?.data?.qty,
                    qty_box: result?.data?.qty_box,
                    cbm: result?.data?.cbm,
                    images: Array.isArray(result?.form?.images) && result.form.images.length > 0
                        ? result.form.images.map((img: any) => ({
                            image_url: this.getUrl(img.image),
                            image: img.image,
                        }))
                        : [],
                });
                // ลบรายการเดิมและแทนที่ด้วรายการที่อัปเดตแล้ว
                lists.removeAt(productIndex);
                lists.insert(productIndex, updatedProductForm);

                this._changeDetectorRef.markForCheck();
            }
        });
    }

    openAddProductWait(): void {
        const dialogRef = this.dialog.open(DialogProductWaitComponent, {
            disableClose: true,
            width: '70%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: { type: '' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;

            const track = this.tracksArray.at(this.index_track);
            if (!track) return;

            const lists = track.get('lists') as FormArray;

            result.forEach((item: DeliveryOrderList) => {
                const duplicateTrack = this.tracksArray.controls.find((track) =>
                    (track.get('lists') as FormArray).controls.some(
                        (product) => product.value.product_draft_id === item.id
                    )
                );

                if (duplicateTrack) {
                    const trackNo = duplicateTrack.get('track_no').value;
                    this.toastr.warning(
                        `${this.translocoService.translate(
                            'toastr.have_pro'
                        )}: ${item.product_name
                        } ${this.translocoService.translate(
                            'toastr.in_track'
                        )}: ${trackNo}`
                    );
                    return;
                }

                item.cbm = calculateCBM(
                    +item.width,
                    +item.height,
                    +item.long,
                    +item.qty_box
                );

                const productForm = this.createProduct({
                    ...item,
                    product_draft_id: item.id,
                });

                lists.push(productForm);
            });
        });
    }

    // Checkbox selection methods
    SelectAll(checked: boolean): void {
        this.selectAll = checked;
        this.tracksArray.controls.forEach((track) =>
            track.get('IsChecked').setValue(this.selectAll)
        );
        this._changeDetectorRef.detectChanges();
    }

    updateAllselect(): void {
        // ตรวจสอบว่าควรเป็น checked หรือ indeterminate
        const allChecked =
            this.tracksArray.controls?.length > 0 &&
            this.tracksArray.controls.every(
                (track) => track.get('IsChecked').value
            );

        const someChecked = this.tracksArray.controls?.some(
            (track) => track.get('IsChecked').value
        );

        // ตั้งค่า checkbox หลัก
        this.selectAll = allChecked;

        // ต้องเรียก detectChanges เพื่อให้ UI อัปเดต
        this._changeDetectorRef.detectChanges();
    }

    someSelect(): boolean {
        if (!this.tracksArray.controls?.length) {
            return false;
        }
        // จะ return true เฉพาะเมื่อบางรายการถูกเลือก (แต่ไม่ใช่ทั้งหมด)
        const someChecked = this.tracksArray.controls.some(
            (track) => track.get('IsChecked').value
        );
        const allChecked = this.tracksArray.controls.every(
            (track) => track.get('IsChecked').value
        );

        return someChecked && !allChecked;
    }

    SelectAllProducts(checked: boolean): void {
        if (!this.hasAnyProducts()) {
            return;
        }
        this.selectAllProducts = checked;
        this.listsArray.controls.forEach((product) =>
            product.get('IsChecked').setValue(this.selectAllProducts)
        );
        this._changeDetectorRef.detectChanges();
    }

    updateAllSelectProducts(): void {
        if (!this.hasAnyProducts()) {
            this.selectAllProducts = false;
            return;
        }
        this.selectAllProducts = this.listsArray.controls.every(
            (product) => product.value.IsChecked
        );
        this._changeDetectorRef.detectChanges();
    }

    someSelectProducts(): boolean {
        if (!this.hasAnyProducts()) {
            return false;
        }
        // Return true only if some products are selected but not all
        const someChecked = this.listsArray.controls.some(
            (product) => product.value.IsChecked
        );
        const allChecked = this.listsArray.controls.every(
            (product) => product.value.IsChecked
        );

        return someChecked && !allChecked;
    }

    // Deletion methods
    removetrack(index: number): void {
        this.tracksArray.removeAt(index);
    }

    removelist(index: number): void {
        this.listsArray.removeAt(index);
    }

    removeSelectedTracks(): void {
        this.showConfirmationDialog(() => {
            const selectedTracks = this.tracksArray.controls.filter(
                (track) => track.value.IsChecked
            );

            // Check if the currently selected track is among those to be deleted
            const currentSelectedTrack =
                this.index_track !== undefined
                    ? this.tracksArray.at(this.index_track)
                    : null;
            const willDeleteCurrentTrack =
                currentSelectedTrack &&
                selectedTracks.includes(currentSelectedTrack);

            selectedTracks.forEach((track) => {
                const index = this.tracksArray.controls.indexOf(track);
                if (index !== -1) {
                    this.removetrack(index);
                }
            });

            // Reset index_track if the currently selected track was deleted
            if (willDeleteCurrentTrack || this.tracksArray.length === 0) {
                this.index_track = undefined;
            } else if (
                this.index_track !== undefined &&
                this.index_track >= this.tracksArray.length
            ) {
                // If the index is now out of bounds, adjust it
                this.index_track = this.tracksArray.length - 1;
            }

            this.updateAllselect();
            this._changeDetectorRef.detectChanges();
        }, 'confirmation.confirm_removal_tracking');
    }

    removeSelectedProducts(): void {
        // Check if any products are selected using hasSelectedProducts method
        if (!this.hasSelectedProducts()) {
            this.toastr.warning(
                this.translocoService.translate('toastr.no_products_selected')
            );
            return;
        }

        // Get the selected products
        const selectedProducts = this.listsArray.controls.filter(
            (product) => product.value.IsChecked
        );

        this.showConfirmationDialog(() => {
            selectedProducts.forEach((product) => {
                const index = this.listsArray.controls.indexOf(product);
                if (index !== -1) {
                    this.removelist(index);
                }
            });

            this.updateAllSelectProducts();
        }, 'confirmation.confirm_removal_product');
    }

    // Utility methods
    selectMember(event: any): void {
        this.form.patchValue({
            member_id: event.id,
        });
    }
    selectAgent(event: any): void {
        this.form.patchValue({
            member_importer_code_id: event.id,
        });
    }

    getUrl(path: string): string {
        if (!path) {
            return '';
        }
        return this.utilityService.getFullUrl(path);
    }

    protected _filterorder(): void {
        if (!this.orders) {
            return;
        }

        let search = this.ordersFilter.value;

        if (!search) {
            this.filterorders.next(this.orders.slice());
            return;
        }

        search = search.toString().toLowerCase();

        this.filterorders.next(
            this.orders.filter((item) =>
                item.code.toLowerCase().includes(search)
            )
        );
    }

    onSelectorder(event: any): void {
        if (!event) {
            if (this.ordersFilter.invalid) {
                this.ordersFilter.markAsTouched();
            }
            return;
        }

        this.form.patchValue({
            order_id: event.id,
        });

        this.ordersFilter.setValue(`${event.code}`);
    }

    // Calculation methods
    get totallist(): number {
        return this.listsArray.length;
    }

    get totalBoxes(): string {
        return this.listsArray.controls
            .reduce(
                (total, product) =>
                    total + Number(product.get('qty_box')?.value || 0),
                0
            )
            .toFixed(0);
    }

    get totalUnits(): string {
        return this.listsArray.controls
            .reduce((total, product) => {
                const qty = Number(product.get('qty')?.value || 0);
                const qtyBox = Number(product.get('qty_box')?.value || 0);
                return total + qty * qtyBox;
            }, 0)
            .toFixed(0);
    }

    get totalWeight(): string {
        return this.listsArray.controls
            .reduce((total, product) => {
                const qty = Number(product.get('qty_box')?.value || 0);
                const Weight = Number(product.get('weight')?.value || 0);
                return total + qty * Weight;
            }, 0)
            .toFixed(4);
    }

    get totalCBM(): number {
        const total = this.listsArray.controls.reduce((total, product) => {
            const width = Number(product.get('width')?.value || 0);
            const height = Number(product.get('height')?.value || 0);
            const length = Number(product.get('long')?.value || 0);
            const qty = Number(product.get('qty_box')?.value || 0);
            return total + ((width * height * length) / 1000000) * qty;
        }, 0);
        return parseFloat(total.toFixed(4));
    }

    // Helper methods for dialogs
    private showConfirmationDialog(
        onConfirm: () => void,
        titleKey = 'confirmation.save_title'
    ): void {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate(titleKey),
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
            if (result === 'confirmed') {
                onConfirm();
            }
        });
    }

    getProductTypeName(productTypeId: number): string {
        if (
            !productTypeId ||
            !this.product_type ||
            this.product_type.length === 0
        ) {
            return '-';
        }

        const foundType = this.product_type.find(
            (type) => type.id === productTypeId
        );
        return foundType ? foundType.name : '-';
    }

    filterTracks(searchText: string): void {
        if (!searchText) {
            this.filteredTracks = [];
            return;
        }

        searchText = searchText.toLowerCase().trim();

        // Filter tracks by track_no that contains the search text
        this.filteredTracks = this.tracksArray.controls.filter((track) =>
            track.get('track_no').value.toLowerCase().includes(searchText)
        );

        this._changeDetectorRef.detectChanges();
    }
    hasSelectedTracks(): boolean {
        return this.tracksArray.controls.some(
            (track) => track.get('IsChecked')?.value
        );
    }

    hasAnyProducts(): boolean {
        return this.listsArray.controls?.length > 0;
    }

    hasSelectedProducts(): boolean {
        if (!this.hasAnyProducts()) {
            return false;
        }
        // Check if any products are selected by looking at the value property
        return this.listsArray.controls.some(
            (product) => product.value.IsChecked
        );
    }

    showPicture(images: any[]): void {
        const imgList = images.map(item => item.image_url);
        this.dialog.open(PictureMultiComponent, {
            data: {
                images: imgList,
                selectedIndex: 0
            },
            width: '90vw',
            height: '90vh',
        });
    }

    openScancodeDialog() {
        const dialogRef = this.dialog.open(ScanBarcodeDialogComponent, {
            width: '500px',
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {

                this.searchCode(result);
                // console.log(result, 'result');

            } else {
            }
        });
    }

    searchCode(code: string) {
        const body = {
            draw: 1,
            columns: [],
            order: [{ column: 0, dir: 'asc' }],
            start: 0,
            length: 1,
            search: { value: code, regex: false },
        };

        this._service.datatatacking(body)
            .pipe(map((resp: { data: any }) => resp.data))
            .subscribe({
                next: (resp: any) => {
                    if (resp.data.length > 0) {

                        const result = resp.data;

                        const tracks = this.tracksArray;
                        const existingTracks: string[] = [];
                        const newTracks: any[] = [];
                        const tracksToSelect: any[] = [];

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

                                // เก็บรายการที่ต้อง select ทีหลัง (ทั้ง found และ new)
                                tracksToSelect.push(existingTrack ?? track);
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

                            tracksToSelect.push(existingTrack ?? result);
                        }

                        // แสดง toastr หากมี track ซ้ำ
                        if (existingTracks.length > 0) {
                            this.toastr.error(`${this.translocoService.translate('toastr.track_in_po')}: ${existingTracks.join(', ')}`);
                        }

                        // push tracks ใหม่เข้า FormArray
                        newTracks.forEach((track: any) => {
                            if (track.member) {
                                this.form.patchValue({
                                    member_id: track.member.id,
                                    order_id: track.order.id,
                                });
                                this.ordersFilter.setValue(track.order.code);
                                this.memberIdToEdit = track.member.id;
                            }

                            const trackForm = this.createTrack({
                                track_id: track.id,
                                track_no: track.track_no,
                                date: track.date,
                            });
                            tracks.push(trackForm);
                        });

                        // select หลังจาก push ครบ
                        tracksToSelect.forEach((track: any) => {
                            this.selectTrack(track);
                        });

                    } else {
                        this.errorAudio.currentTime = 0;
                        this.errorAudio.play().catch((e) => {
                            console.warn('Error sound failed to play', e);
                        });

                        // this.toastr.error('Not Found');

                        const confirmation = this.fuseConfirmationService.open({
                            title: this.translocoService.translate(
                                'confirmation.confirm_add_tracking'
                            ),
                            message: this.translocoService.translate(
                                'confirmation.confirm_add_trackingmessage'
                            ),
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
                                const formdata = {
                                    track_no: code,
                                    date: new Date().toISOString().split('T')[0],
                                };
                                this._service.createTracking(formdata).subscribe({
                                    next: (response: any) => {
                                        this.toastr.success(
                                            this.translocoService.translate('toastr.add')
                                        );
                                        const tracks = this.tracksArray;
                                        const trackForm = this.createTrack({
                                            track_id: response.data.id,
                                            track_no: response.data.track_no,
                                            date: response.data.date,
                                        });
                                        tracks.push(trackForm);
                                        this.selectTrack(response.data);
                                        // this.dialogRef.close(response.data);
                                    },
                                    error: (error) => {
                                        this.toastr.error(
                                            this.translocoService.translate(
                                                'toastr.add_error'
                                            )
                                        );
                                        console.log(error);
                                    },
                                });
                            }
                        });

                    }
                },
            });
    }

    addService(): void {
        this.add_on_servicesArray.push(
            this.formBuilder.group({
                add_on_service_id: [null],
                name: [''],
                price: [0],
            })
        );
    }

    removeService(index: number): void {
        this.add_on_servicesArray.removeAt(index);
    }
}
