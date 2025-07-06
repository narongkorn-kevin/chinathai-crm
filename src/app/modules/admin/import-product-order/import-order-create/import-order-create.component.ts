import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
// import { PoService } from './po.service';
import { filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { ImportProductOrderService } from '../import-product-order.service';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateTime } from 'luxon';
import { DialogAddressComponent } from '../../member/dialog-address/dialog-address.component';
import { DialogAddress } from '../../member/dialog-address/dialog-address';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { items } from 'app/mock-api/apps/file-manager/data';

@Component({
    selector: 'app-import-order-create',
    standalone: true,
    imports: [
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
        MatLabel,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatBadgeModule,
        RouterLink,
        SelectImporterComponent,
        SelectMemberComponent,
        UploadFileComponent
    ],
    templateUrl: './import-order-create.component.html',
    styleUrl: './import-order-create.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class ImportOrderCreateComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];

    categoryFee: any[] = [];
    store$: Observable<any>;
    po$: Observable<any>;

    form: FormGroup;
    search: FormControl = new FormControl('', []);

    protected _onDestroy = new Subject<void>();

    selectAll: boolean = false;

    purchaseOrder: any[] = [];

    invoiceFiles: any[] = [];
    packingListFiles: any[] = [];
    otherFiles: any[] = [];

    constructor(
        private _service: ImportProductOrderService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _decimalPipe: DecimalPipe,
        private _fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.form = this._fb.group({
            register_importer_id: [],
            member_id: [],
            import_product_order_id: [],
            store_id: [''],
            note: [],
            invoice_file: [],
            packinglist_file: [],
            license_file: [],
            fees: [],
            lists: [],
        })

        this.store$ = this._service.getStore()
            .pipe(
                map((resp: any) => resp.data)
            );

        this.po$ = this.form.get('member_id').valueChanges.pipe(
            filter(value => !!value), // กรองค่าที่เป็น null หรือ undefined
            switchMap((value) => this._service.getImportPo(value).pipe(
                map((resp: any) => resp.data)
            ))
        );

        this._service.getCategoryFee()
            .pipe(
                map((resp: any) => {
                    for (const item1 of resp.data) {
                        for (const item2 of item1?.fees) {
                            item2.amount = null
                        }
                    }

                    return resp.data;
                })
            ).subscribe({
                next: (resp: any) => {
                    this.categoryFee = resp
                },
                error: (err: any) => { },
            });
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
    }

    async submit() {
        if (this.form.invalid) {
            this.toastr.error('ระบุข้อมูลไม่ครบ');
            return
        }

        const confirmation = this.fuseConfirmationService.open({
            title: "ยืนยันการบันทึกข้อมูล",
            icon: {
                show: true,
                name: "heroicons_outline:exclamation-triangle",
                color: "primary"
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
            async result => {
                if (result == 'confirmed') {

                    const filesToUpload = [
                        this.invoiceFiles.length > 0 ? this.uploadImage(this.invoiceFiles[0]?.file) : Promise.resolve(null),
                        this.packingListFiles.length > 0 ? this.uploadImage(this.packingListFiles[0]?.file) : Promise.resolve(null),
                        this.otherFiles.length > 0 ? this.uploadImage(this.otherFiles[0]?.file) : Promise.resolve(null),
                    ];

                    const [file1, file2, file3] = await Promise.all(filesToUpload);

                    this.form.patchValue({
                        invoice_file: file1?.data ?? null,
                        packinglist_file: file2?.data ?? null,
                        license_file: file3?.data ?? null,
                    });

                    const fees = this.categoryFee.map(e => e.fees.map(f => ({ fee_master_id: f.id, amount: f.amount, }))).flat();

                    const body = {
                        ...this.form.value,
                        lists: this.seletedList.map(e => ({ delivery_order_list_id: e })),
                        fees: fees,
                    }

                    this._service.createImportProductOrder(body).subscribe(
                        (resp: any) => {
                            const body1 = {
                                import_product_order_id: resp.data.id,
                                fees: fees,
                            }

                            this._service.updateFeeAmount(body1).subscribe({
                                next: (resp: any) => {
                                    this.toastr.success('เพิ่มรายการ สำเร็จ');
                                    // this._router.navigateByUrl('/order-products');
                                },
                                error: (err: any) => {
                                    console.error(err);
                                    this.toastr.error('เพิ่มรายการ ไม่สำเร็จ');
                                },
                            })
                        },
                        (err) => {
                            console.error(err);
                            this.toastr.error('เพิ่มรายการ ไม่สำเร็จ');
                        }
                    )
                }
            }
        )

    }

    someSelect(): boolean {
        if (this.purchaseOrder == null) {
            return false;
        }
        return this.purchaseOrder.filter(t => t.IsChecked).length > 0 && !this.selectAll;
    }

    clearSelection() {
        this.purchaseOrder.forEach(item => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.purchaseOrder.forEach((item) => (item.IsChecked = this.selectAll));
    }

    updateAllselect() {
        this.selectAll = this.purchaseOrder != null && this.purchaseOrder.every(t => t.IsChecked);
    }

    get seletedList() {
        return this.purchaseOrder != null && this.purchaseOrder.filter(t => t.IsChecked).map(e => e.id);
    }

    selectImporter(event: any) {
        this.form.patchValue({
            register_importer_id: event?.id,
            member_id: event?.member?.id
        })

        if (event?.member?.id) {
            this._service.getDeliveryAllOrdersByMember(event?.member?.id)
                .pipe(
                    map((resp: any) => {
                        for (const e of resp.data) {
                            e.IsChecked = false;
                        }
                        return resp.data;
                    }),
                )
                .subscribe({
                    next: (resp: any) => {
                        this.purchaseOrder = resp
                    },
                    error: (err: any) => {
                        this.toastr.error('เกิดข้อผิดพลาด');
                    },
                })
        }

    }

    selectMember(event: any) {
        console.log(event);
    }

    selectFileInvoice(event: any) {
        this.invoiceFiles = event
    }

    selectFilePackingList(event: any) {
        this.packingListFiles = event
    }

    selectFileOther(event: any) {
        this.otherFiles = event
    }

    uploadImage(file: File) {
        return new Promise((resolve, reject) => {
            // const file = this.uploadedFiles[0]?.file;

            if (!file) {
                reject(new Error("No file selected"));
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('path', 'images/asset/');

            this._service.upload(formData).subscribe({
                next: (resp: any) => resolve(resp),
                error: (err: any) => reject(err)
            });
        });
    }
}
