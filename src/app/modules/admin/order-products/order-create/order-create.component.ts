import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
// import { PoService } from './po.service';
import {
    catchError,
    map,
    Observable,
    of,
    switchMap,
    throwError,
    timeout,
} from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderProductsService } from '../order-products.service';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LocationService } from 'app/location.service';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DialogProductComponent } from '../../dialog/dialog-product/dialog-product.component';
import { DateTime } from 'luxon';
import { MatBadgeModule } from '@angular/material/badge';
import { DialogProductComposeComponent } from '../../dialog/dialog-product-compose/dialog-product-compose.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslateTextPipe } from 'app/modules/shared/translate.pipe';
import { TranslationService } from 'app/modules/shared/translate.service';
import { MatTooltipModule } from '@angular/material/tooltip';

type ShippingAddress = {
    id?: number;
    name?: string;
    phone?: string;
    address?: string;
    province?: string;
    district?: string;
    sub_district?: string;
    postal_code?: string;
    province_code?: string;
    district_code?: string;
    sub_district_code?: string;
    is_default?: boolean;
    [key: string]: any;
};

type MemberProfile = {
    id: number;
    code: string;
    importer_code: string;
    fname: string;
    lname: string;
    phone: string;
    email: string | null;
    member_type: string;
    gender?: string | null;
    line_id?: string | null;
    referrer?: string | null;
    address?: string | null;
    province?: string | null;
    district?: string | null;
    sub_district?: string | null;
    postal_code?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    ship_address?: ShippingAddress[] | null;
    [key: string]: any;
};

@Component({
    selector: 'app-order-create',
    standalone: true,
    imports: [
        TranslocoModule,
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        CdkMenuModule,
        MatCheckboxModule,
        FormsModule,
        FuseDrawerComponent,
        MatLabel,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        MatBadgeModule,
        TranslateTextPipe,
        MatTooltipModule
    ],
    templateUrl: './order-create.component.html',
    styleUrl: './order-create.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class OrderCreateComponent implements OnInit, AfterViewInit {
    products: any[] = [];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    totalItems = 0; // ใช้เก็บจำนวน item ทั้งหมดจาก API
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    data: any;
    selectedService: '1688' | 'taobao' = '1688';

    // cart: IOrderProduct[] = [];
    cart: any[] = [];
    memberLoading = false;
    memberError: string | null = null;
    memberData: MemberProfile | null = null;
    shippingAddresses: ShippingAddress[] = [];
    selectedAddressId: number | null = null;
    selectedAddressRef: ShippingAddress | null = null;
    private normalizeProducts(items: any): any[] {
        if (!items) {
            return [];
        }
        return Array.isArray(items) ? items : [items];
    }

    provinces$: Observable<any>;
    districts$: Observable<any>;
    subdistricts$: Observable<any>;

    form: FormGroup;
    search: FormControl = new FormControl('', []);

    addOnServices: any[] = [];

    drawerOpened = false;
    activeTabIndex = 0;

    constructor(
        private translocoService: TranslocoService,
        private _service: OrderProductsService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _decimalPipe: DecimalPipe,
        private locationService: LocationService,
        private _fb: FormBuilder,
        private translationService: TranslationService
    ) { }

    ngOnInit(): void {
        this.provinces$ = this.locationService.getProvinces();
        this.districts$ = this.locationService.getDistricts();
        this.subdistricts$ = this.locationService.getSubdistricts();

        this._service.getAddOnService().subscribe((resp: any) => {
            this.addOnServices = resp.data;
        });

        const now = DateTime.local().toFormat('yyyy-MM-dd');

        this.form = this._fb.group({
            date: now,
            total_price: [],
            member_id: [null, Validators.required],
            member_address_id: [null, Validators.required],
            shipping_type: ['car', Validators.required],
            payment_term: ['2', Validators.required],
            address: [''],
            province: [''],
            province_code: [''],
            district: [''],
            district_code: [''],
            sub_district: [''],
            sub_district_code: [''],
            postal_code: [''],
            importer_code: [''],
            phone: [''],
            email: [],
            note: [],
            bill_vat: 'N',
        });

        this.loadCurrentMember();
    }

    refreshMember(): void {
        this.loadCurrentMember();
    }

    selectShippingAddress(address: ShippingAddress): void {
        if (!address) {
            return;
        }
        this.selectedAddressId = address.id ?? null;
        this.selectedAddressRef = address;
        this.applyShippingAddress(address);
    }

    isAddressSelected(address: ShippingAddress): boolean {
        if (!address) {
            return false;
        }
        if (this.selectedAddressRef && this.selectedAddressRef === address) {
            return true;
        }
        const addressId = address.id ?? null;
        return addressId !== null && addressId === this.selectedAddressId;
    }

    private loadCurrentMember(): void {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            this.memberLoading = false;
            this.memberError = 'ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่';
            this.memberData = null;
            this.shippingAddresses = [];
            this.clearShippingAddressSelection();
            return;
        }

        let memberId: number | null = null;
        try {
            const parsed = JSON.parse(storedUser);
            memberId = parsed?.id ?? null;
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
        }

        if (!memberId) {
            this.memberLoading = false;
            this.memberError = 'ไม่สามารถระบุผู้ใช้งานได้ กรุณาเข้าสู่ระบบใหม่';
            this.memberData = null;
            this.shippingAddresses = [];
            this.clearShippingAddressSelection();
            return;
        }

        this.memberLoading = true;
        this.memberError = null;

        this._service.getMemberById(memberId)
            .pipe(map((resp: any) => resp?.data as MemberProfile))
            .subscribe({
                next: (data: MemberProfile) => {
                    this.memberLoading = false;
                    if (!data) {
                        this.memberData = null;
                        this.memberError = 'ไม่พบข้อมูลสมาชิก';
                        this.shippingAddresses = [];
                        this.clearShippingAddressSelection();
                        return;
                    }

                    this.memberData = data;
                    this.form.patchValue({
                        member_id: data.id,
                        importer_code: data.importer_code ?? '',
                        phone: data.phone ?? '',
                        email: data.email ?? '',
                        address: data.address ?? '',
                        province: data.province ?? '',
                        district: data.district ?? '',
                        sub_district: data.sub_district ?? '',
                        postal_code: data.postal_code ?? '',
                    }, { emitEvent: false });

                    this.shippingAddresses = Array.isArray(data.ship_address) ? data.ship_address : [];
                    this.selectedAddressRef = null;
                    this.selectedAddressId = null;
                    const defaultAddress =
                        this.shippingAddresses.find((addr) => addr?.is_default) ??
                        this.shippingAddresses[0] ??
                        null;

                    if (defaultAddress) {
                        this.selectShippingAddress(defaultAddress);
                    } else {
                        this.clearShippingAddressSelection();
                    }
                },
                error: (error) => {
                    console.error('Error fetching member data', error);
                    this.memberLoading = false;
                    this.memberError = 'ไม่สามารถโหลดข้อมูลลูกค้าได้';
                    this.memberData = null;
                    this.shippingAddresses = [];
                    this.clearShippingAddressSelection();
                },
            });
    }

    private applyShippingAddress(address: ShippingAddress): void {
        this.form.patchValue({
            member_address_id: address.id ?? null,
            address: address.address ?? '',
            province: address.province ?? '',
            province_code: address.province_code ?? '',
            district: address.district ?? '',
            district_code: address.district_code ?? '',
            sub_district: address.sub_district ?? '',
            sub_district_code: address.sub_district_code ?? '',
            postal_code: address.postal_code ?? '',
        }, { emitEvent: false });

        if (address.province) {
            this.locationService.getProvinces().pipe(
                map((provinces: any[]) => provinces.find((p: any) => p.provinceNameTh === address.province)),
            ).subscribe((province) => {
                if (province?.provinceCode) {
                    this.locationService.getDistricts(province.provinceCode)
                        .subscribe((districts) => {
                            this.districts$ = of(districts);
                        });
                }
            });
        }

        if (address.district) {
            this.locationService.getDistricts().pipe(
                map((districts: any[]) => districts.find((d: any) => d.districtNameTh === address.district)),
            ).subscribe((district) => {
                if (district?.districtCode) {
                    this.locationService.getSubdistricts(district.districtCode)
                        .subscribe((subdistricts) => {
                            this.subdistricts$ = of(subdistricts);
                        });
                }
            });
        }
    }

    private clearShippingAddressSelection(): void {
        this.selectedAddressId = null;
        this.selectedAddressRef = null;
        this.form.patchValue({
            member_address_id: null,
            address: '',
            province: '',
            province_code: '',
            district: '',
            district_code: '',
            sub_district: '',
            sub_district_code: '',
            postal_code: '',
        }, { emitEvent: false });
    }


    ngAfterViewInit() {
        // merge(this.paginator.page)
        //     .pipe(
        //         startWith({}),
        //         switchMap(() => {
        //             return this._service.get1688Category(
        //                 this.search.value,
        //                 this.paginator.pageIndex + 1, // Page เริ่มที่ 1
        //             );
        //         }),
        //         map((data: any) => {
        //             this.totalItems = data.item.items.total_results; // ตั้งค่าจำนวนรายการทั้งหมด
        //             return data.item.items.item || [];
        //         }),
        //         catchError(() => [])
        //     )
        //     .subscribe(data => {
        //         this.products = data;
        //     });

        // ให้ paginator ทำงานต่อเมื่อมีข้อมูลแล้ว
        this.paginator.page
            .pipe(
                switchMap(() => {
                    if (!this.products.length || this.totalItems === 0) {
                        return of([]); // ถ้ายังไม่มีข้อมูล ให้คืนค่า array ว่าง
                    }
                    return this._service.getCategory(
                        this.search.value,
                        this.paginator.pageIndex + 1,
                        this.selectedService
                    );
                }),
                map((data: any) => {
                    this.totalItems = data?.item?.items?.total_results || 0;
                    return this.normalizeProducts(data?.item?.items?.item);
                }),
                catchError(() => [])
            )
            .subscribe((data) => {
                this.products = data;
            });
    }

    ngOnDestroy(): void { }
    setActiveTab(index: number): void {
        this.activeTabIndex = index;
    }

    onProvinceChange() {
        const selectedProvince = this.form.get('province')?.value;
        if (selectedProvince) {
            this.locationService.getProvinces().pipe(
                map((provinces: any[]) => provinces.find((p: any) => p.provinceNameTh === selectedProvince)),
            ).subscribe((province) => {
                this.locationService.getDistricts(province.provinceCode)
                    .subscribe((data) => {
                        this.districts$ = of(data);
                        this.form.patchValue({
                            district: '',
                            sub_district: '',
                            postal_code: '',
                        }, { emitEvent: false });
                    });
            });
        }
    }

    onDistrictChange() {
        const selectedDistrict = this.form.get('district')?.value;
        if (selectedDistrict) {
            this.locationService.getDistricts().pipe(
                map((districts: any[]) => districts.find((d: any) => d.districtNameTh === selectedDistrict)),
            ).subscribe((district) => {
                this.locationService.getSubdistricts(district.districtCode)
                    .subscribe((data) => {
                        this.subdistricts$ = of(data);
                        this.form.patchValue({ sub_district: '', postal_code: '' }, { emitEvent: false });
                    });
            });
        }
    }

    onSubDistrictChange() {
        const selectedSubDistrict = this.form.get('sub_district')?.value;
        if (selectedSubDistrict) {
            this.locationService.getSubdistricts().pipe(
                map((subdistricts: any[]) => subdistricts.find((s: any) => s.subdistrictNameTh === selectedSubDistrict)),
            ).subscribe((subdistrict) => {
                this.form.patchValue({ postal_code: subdistrict.postalCode }, { emitEvent: false });
            });
        }
    }

    clickSearchProduct() {
        if (this.search.invalid) {
            return;
        }

        const value = this.search.value;

        // regex เช็คว่าเป็น URL หรือไม่
        const urlRegex = /^(https?:\/\/[^\s]+)$/i;

        if (urlRegex.test(value)) {
            // ถ้าเป็น URL → เรียกฟังก์ชันพิเศษแทน
            this.handleUrlSearch(value);
            return;
        }

        if (this.paginator) {
            this.paginator.pageIndex = 0;
        }


        this._service
            .getCategory(
                this.search.value,
                (this.paginator?.pageIndex ?? 0) + 1,
                this.selectedService
            )
            .pipe(
                map((data: any) => {
                    if (data.status === 'error') {
                        this.toastr.error(this.translocoService.translate('toastr.search_error'));
                        return [];
                    }

                    this.totalItems = data?.item?.items?.total_results || 0; // ตั้งค่าจำนวนรายการทั้งหมด
                    return this.normalizeProducts(data?.item?.items?.item);
                }),
                catchError(() => [])
            )
            .subscribe(
                (data) => {
                    this.products = data;
                    console.log(this.products, 'data');
                },
                (error) => {
                    console.error('Error fetching data:', error);
                    this.toastr.error(this.translocoService.translate('toastr.search_error'));
                }
            );
    }

    // ฟังก์ชันพิเศษเมื่อเป็น URL
    handleUrlSearch(url: string) {
        console.log("Detected URL:", url);
        // เรียก service หรือ logic อื่น ๆ ได้ตรงนี้
        this._service.getProductFromUrl(url).subscribe(
            (res: any) => {
                this.selectedService = res.platform
                this.viewDetail(res.productId)

            },
            (err) => {
                console.error(err);
                this.toastr.error(this.translocoService.translate('toastr.search_error'));
            }
        );
    }

    viewDetail(num_iid: string) {
        this._service
            .getDetail(num_iid, this.selectedService)
            .pipe(
                timeout(60000),
                catchError(error => {
                    if (error.name === 'TimeoutError') {
                        this.toastr.warning(this.translocoService.translate('request_timeout'));
                    } else {
                        // แสดงข้อความ error ทั่วไป
                        this.toastr.error(
                            this.translocoService.translate('ไม่สามารถเรียก API 1688 หรือ taobao ได้'),
                            this.translocoService.translate('error')
                        );
                    }
                    return throwError(() => error);
                })
            )
            .subscribe({
                next: (productDetail: any) => {
                    this.openDialog(productDetail);
                },
                error: err => {
                    console.error('API Error: ', err);
                    this.translocoService.translate('error')
                }
            });
    }


    openDialog(productDetail: any): void {
        const dialogRef = this.dialog.open(DialogProductComponent, {
            width: '800px',
            data: {
                product: productDetail,
                addOnServices: this.addOnServices,
                productStoreType: this.selectedService,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.cart.push(result);
                console.log(result);

                this.openCart();
            }
        });
    }

    openCart() {
        this.drawerOpened = !this.drawerOpened;
    }

    increaseQuantity(item: any): void {
        item.product_qty++;
    }

    decreaseQuantity(item: any): void {
        if (item.product_qty > 1) {
            item.product_qty--;
        } else {
            this.removeFromCart(item);
        }
    }

    removeFromCart(item: any): void {
        if (!Array.isArray(this.cart) || this.cart.length === 0) {
            return;
        }

        const index = this.cart.indexOf(item);

        const removeAt = index !== -1
            ? index
            : this.cart.findIndex((cartItem) => cartItem?.id && cartItem.id === item?.id);

        if (removeAt === -1) {
            return;
        }

        this.cart = [
            ...this.cart.slice(0, removeAt),
            ...this.cart.slice(removeAt + 1),
        ];
    }

    submit() {
        // if (this.form.invalid) {
        //     this.toastr.error(this.translocoService.translate('toastr.missing_fields'));
        //     return;
        // }

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
                
                // หาก this.cart เป็น array ของ FormGroup
                const products = this.cart.map((p: any) => {
                    // ถ้า p เป็น FormGroup -> ดึงค่าออก
                    const value = p?.getRawValue ? p.getRawValue() : p;

                    // กันพลาด: แปลง options ให้เป็น array ของ plain objects เสมอ
                    const options =
                        Array.isArray(value.options)
                            ? value.options
                            : (value.options?.getRawValue ? value.options.getRawValue() : []);

                    return {
                        ...value,
                        product_code: value?.product_code !== undefined && value?.product_code !== null
                            ? String(value.product_code)
                            : '',
                        options,                 // => [{ option_name, option_image, option_note }]
                        add_on_services: value.add_on_services ?? []
                    };
                });
                const body = {
                    ...this.form.value,
                    products,
                    total_price: this.calculateTotalPrice(),
                };
                console.log(body, 'body');

                this._service.createOrder(body).subscribe(
                    (resp: any) => {
                        this.toastr.success(this.translocoService.translate('toastr.add'));
                        this._router.navigateByUrl('/order-products');
                    },
                    (err) => {
                        this.toastr.error(
                            this.translocoService.translate('toastr.add_error')
                        );
                    }
                );
            }
        });
    }

    private calculateTotalPrice(): number {
        return this.cart.reduce((total, item) => {
            const basePrice = parseFloat(item.product_price) * item.product_qty;
            const addOnPrice = item.add_on_services.reduce(
                (sum, service) => sum + service.add_on_service_price,
                0
            );
            return total + basePrice + addOnPrice;
        }, 0);
    }

    openDialogNewProduct() {
        const dialog = this.dialog.open(DialogProductComposeComponent, {
            width: '90%',
            data: {
                addOnServices: this.addOnServices,
            },
        });

        dialog.afterClosed().subscribe((result) => {
            if (result != undefined) {
                this.cart.push(result);

                this.openCart();
            }
        });
    }


    toggleTranslate(order: any) {
        if (!order.currentLang || order.currentLang === 'zh-CN') {
            // แปลจากจีน → ไทย
            this.translationService.translate(order.product_name, 'zh-CN', 'th').subscribe((translated) => {
                order.translatedProductName = translated;
                order.currentLang = 'th';
            });
        } else {
            // กลับเป็นต้นฉบับ (จีน)
            order.translatedProductName = null;
            order.currentLang = 'zh-CN';
        }
    }

    onImageError(item: any): void {
        item.imageError = true;
    }
}
