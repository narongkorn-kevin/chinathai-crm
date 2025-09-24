import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
// import { PoService } from './po.service';
import {
    catchError,
    filter,
    map,
    Observable,
    of,
    ReplaySubject,
    Subject,
    switchMap,
    takeUntil,
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DialogProductComponent } from '../../dialog/dialog-product/dialog-product.component';
import { DateTime } from 'luxon';
import { DialogAddressComponent } from '../../member/dialog-address/dialog-address.component';
import { DialogAddress } from '../../member/dialog-address/dialog-address';
import { MatBadgeModule } from '@angular/material/badge';
import { DialogProductComposeComponent } from '../../dialog/dialog-product-compose/dialog-product-compose.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslateTextPipe } from 'app/modules/shared/translate.pipe';
import { TranslationService } from 'app/modules/shared/translate.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
        MatTableModule,
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
        MatAutocompleteModule,
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
    displayedColumns: string[] = [
        'title',
        'pic_url',
        'price',
        'detail_url',
        'action',
    ];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    totalItems = 0; // ใช้เก็บจำนวน item ทั้งหมดจาก API
    @ViewChild('customerInput') customerInput!: ElementRef<HTMLInputElement>;
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    data: any;
    selectedService: '1688' | 'taobao' = '1688';

    // cart: IOrderProduct[] = [];
    cart: any[] = [];

    provinces$: Observable<any>;
    districts$: Observable<any>;
    subdistricts$: Observable<any>;

    form: FormGroup;
    search: FormControl = new FormControl('', []);

    memberFilter = new FormControl('');
    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    members: any[] = [];
    @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
    addOnServices: any[] = [];

    drawerOpened = false;

    protected _onDestroy = new Subject<void>();

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

        this._service
            .getMember()
            .pipe(
                map((resp: { data: any[] }) => ({
                    ...resp,
                    data: resp.data.map((e) => ({
                        ...e,
                        fullname: `(${e.code}) ${e.fname ?? ''} ${e.lname ?? ''}`,
                    })),
                }))
            )
            .subscribe((member: { data: any[] }) => {
                this.members = member.data;

                this.filterMember.next(this.members);
            });

        this._service.getAddOnService().subscribe((resp: any) => {
            this.addOnServices = resp.data;
        });

        const now = DateTime.local().toFormat('yyyy-MM-dd');

        this.form = this._fb.group({
            date: now,
            total_price: [],
            member_id: [null, Validators.required],
            member_address_id: [null, Validators.required],
            shipping_type: [null, Validators.required],
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

        this.memberFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterEmployee();
            });
    }

    protected _filterEmployee() {
        if (!this.members) {
            return;
        }

        const search = this.memberFilter.value;

        if (!search) {
            this.filterMember.next(this.members.slice());
            return;
        }

        // กรองข้อมูลโดยค้นหาใน firstname และ lastname
        this.filterMember.next(
            this.members.filter((item) => item.fullname.includes(search))
        );
    }

    onSelectMember(event: any) {
        if (!event) {
            this.markInvalidMemberFilter();
            console.log('No Approver Selected');
            return;
        }

        const selectedData = event;

        this.form.patchValue({
            member_id: selectedData.id,
            importer_code: selectedData.importer_code,
            phone: selectedData.phone,
        });

        this.memberFilter.setValue(selectedData.fullname);
        this.openDialogMemberAddress(selectedData.id);

    }

    private markInvalidMemberFilter() {
        if (this.memberFilter.invalid) {
            this.memberFilter.markAsTouched();
        }
    }

    private focusFirstEmptyInput() {
        setTimeout(() => {
            const emptyInput = Array.from(document.querySelectorAll('input'))
                .find(input =>
                    input instanceof HTMLInputElement &&
                    !input.disabled &&
                    input.offsetParent !== null &&
                    !input.value
                );
            (emptyInput as HTMLElement)?.focus();
        }, 0);
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
        //         this.dataSource = new MatTableDataSource(data);
        //     });

        // ให้ paginator ทำงานต่อเมื่อมีข้อมูลแล้ว
        this.paginator.page
            .pipe(
                switchMap(() => {
                    if (!this.dataSource || this.totalItems === 0) {
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
                    return data?.item?.items?.item || [];
                }),
                catchError(() => [])
            )
            .subscribe((data) => {
                this.dataSource = new MatTableDataSource(data);
            });
    }

    ngOnDestroy(): void { }

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

        this._service
            .getCategory(
                this.search.value,
                this.paginator.pageIndex + 1,
                this.selectedService
            )
            .pipe(
                map((data: any) => {
                    if (data.status === 'error') {
                        this.toastr.error(this.translocoService.translate('toastr.search_error'));
                        return [];
                    }

                    this.totalItems = data.item.items.total_results; // ตั้งค่าจำนวนรายการทั้งหมด
                    return data.item.items.item || [];
                }),
                catchError(() => [])
            )
            .subscribe(
                (data) => {
                    this.dataSource = new MatTableDataSource(data);
                    console.log(this.dataSource, 'data');

                },
                (error) => {
                    console.error('Error fetching data:', error);
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
                    }
                    return throwError(() => error);
                })
            )
            .subscribe((productDetail: any) => {
                this.openDialog(productDetail);
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

    openDialogMemberAddress(id: any) {
        this._service.getMemberById(id)
            .pipe(map((resp: any) => resp?.data))
            .subscribe({
                next: (resp: any) => {
                    const dialog = this.dialog.open(DialogAddressComponent, {
                        width: '500px',
                        data: {
                            shipAddress: resp.ship_address
                        }
                    });
                    dialog.afterClosed().subscribe((data: DialogAddress) => {
                        if (data) {
                            this.form.patchValue({
                                member_address_id: data.id,
                                address: data.address,
                                province: data.province,
                                // district: data.district,
                                // sub_district: data.sub_district,
                                // postal_code: data.postal_code,
                            }, { emitEvent: false });

                            this.locationService.getProvinces().pipe(
                                map((provinces: any[]) => provinces.find((p: any) => p.provinceNameTh === data.province)),
                            ).subscribe((province) => {
                                this.locationService.getDistricts(province.provinceCode)
                                    .subscribe((districts) => {
                                        this.districts$ = of(districts);
                                        this.form.patchValue({
                                            district: data.district,
                                        }, { emitEvent: false });

                                        this.locationService.getDistricts().pipe(
                                            map((districts: any[]) => districts.find((d: any) => d.districtNameTh === data.district)),
                                        ).subscribe((district) => {
                                            this.locationService.getSubdistricts(district.districtCode)
                                                .subscribe((subdistricts) => {
                                                    this.subdistricts$ = of(subdistricts);
                                                    this.form.patchValue({
                                                        sub_district: data.sub_district,
                                                        postal_code: data.postal_code
                                                    }, { emitEvent: false });
                                                });
                                        });
                                    });
                            });

                            this.customerInput?.nativeElement.blur();
                            // โฟกัสช่องอื่นแทน
                            // 2. focus ช่อง input ถัดไปที่ยังว่าง
                            setTimeout(() => {
                                const emptyInput = Array.from(document.querySelectorAll('input'))
                                    .find(input =>
                                        input instanceof HTMLInputElement &&
                                        !input.disabled &&
                                        input.offsetParent !== null && // ไม่ถูกซ่อนไว้
                                        input !== this.customerInput?.nativeElement &&
                                        !input.value
                                    );

                                if (emptyInput) {
                                    (emptyInput as HTMLElement).focus();

                                    // 💡 simulate click หากจำเป็น (เช่นถ้ามี logic onClick)
                                    emptyInput.click();
                                }
                            }, 0);
                        }
                    });
                },
                error: (err) => {
                    console.error('Error fetching member by ID', err);
                }
            });

    }

    removeFromCart(item: any): void {
        this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
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
                alert(1)
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
