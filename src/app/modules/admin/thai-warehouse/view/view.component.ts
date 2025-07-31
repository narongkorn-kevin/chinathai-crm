import { CdkMenuModule } from '@angular/cdk/menu';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
} from '@angular/material/dialog';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
// import { CreditService } from '../credit.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { WarehouseService } from '../warehouse.service';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogQRCodeComponent } from 'app/modules/common/dialog-qrcode/dialog-qrcode.component';
import { debounceTime } from 'rxjs/operators';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogPoComponent } from '../dialog-po/dialog-po.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgressBarComponent } from 'app/modules/common/progress-bar/progress-bar.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment';
import { BarcodeDialogComponent } from '../barcode-dialog.component';
import { TimeLineComponent } from 'app/modules/shared/time-line/time-line.component';
import { DateTime } from 'luxon';
import { DialogPoBoxComponent } from '../../stock/lot/dialog-po-box/dialog-po-box.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-member-view-1',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
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
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatDivider,
        RouterLink,
        SelectMemberComponent,
        CdkMenuModule,
        MatTabsModule,
        MatProgressBarModule,
        MatTooltipModule,
        ProgressBarComponent,
        TimeLineComponent,
        MatProgressBarModule
    ],
})
export class ViewComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    lists = [];
    filteredDeliveryOrders: any[] = [];
    product_types: any[] = []
    store: any[] = []
    member: any[] = []

    timelineData = [
        {
            id: '01',
            text: this.translocoService.translate('common.dialog_update_status.status_options.warehouse'),
            value: 'received',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '02',
            text: this.translocoService.translate('common.dialog_update_status.status_options.pallet'),
            value: 'palletized',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '03',
            text: this.translocoService.translate('common.dialog_update_status.status_options.transit_china'),
            value: 'to_border',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '04',
            text: this.translocoService.translate('common.dialog_update_status.status_options.booking'),
            value: 'booked',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '05',
            text: this.translocoService.translate('common.dialog_update_status.status_options.close_container_china'),
            value: 'sealed',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '06',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customs_china'),
            value: 'cn_customs',
            user: '',
            date: '',
            time: '',
            status: false,
            hasButton: true,
        },
        {
            id: '07',
            text: this.translocoService.translate('common.dialog_update_status.status_options.inspection_china'),
            value: 'cn_hold',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '08',
            text: this.translocoService.translate('common.dialog_update_status.status_options.transit_china_thailand'),
            value: 'departed_china',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '09',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customs_thailand'),
            value: 'th_customs',
            user: '',
            date: '',
            time: '',
            status: false,
            hasButton: true,
        },
        {
            id: '10',
            text: this.translocoService.translate('common.dialog_update_status.status_options.warehouse_arrival'),
            value: 'arrived_thailand',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '11',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customer_arrival'),
            value: 'delivering',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '12',
            text: this.translocoService.translate('common.dialog_update_status.status_options.customer_received'),
            value: 'delivered',
            user: '',
            date: '',
            time: '',
            status: false,
        },
        {
            id: '13',
            text: this.translocoService.translate('common.dialog_update_status.status_options.close_container_thai'),
            value: 'closed',
            user: '',
            date: '',
            time: '',
            status: false,
        },
    ];

    packingListData: any;
    countProduct: number = 0
    countInthai: number = 0
    packingList: any[] = [];
    allItem: number;
    inItem: number;
    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: WarehouseService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog,
        private _cdr: ChangeDetectorRef
    ) {
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data?.data?.data;
        this._service.getProductType().subscribe((resp: any) => {
            this.product_types = resp.data
        })
        this._service.getMember().subscribe((resp: any) => {
            this.member = resp.data

        })

        this._service.getPackingList().subscribe((resp: any) => {
            this.packingList = resp.data;
        });

        // this.countProduct = this.data.packling_list_order_lists?.reduce((sum: number, item: any) => {
        //     return sum + (Number(item.delivery_order_list.qty_box) || 0);
        // }, 0);
        this.countProduct = this.data?.delivery_order_list_items?.length;

        this.countInthai = this.data.delivery_order_list_items?.reduce((count: number, item: any) => {
            return count + (item.status === 'out' ? 1 : 0);
        }, 0);

    }
    ngOnInit(): void {
        this.formThai = this.FormBuilder.group({
            date: [null],
            packing_list_id: [null],
            order_lists: this.FormBuilder.array([])
        });
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            in_store: [''],
            code: [''],
            sack_code: [''],
        });

        this.filteredDeliveryOrders = this.data?.packing_list_order_lists.map((item: any) => {
            // const long = Number(item.delivery_order_list?.long);
            const width = Number(item.delivery_order_list?.width);
            const height = Number(item.delivery_order_list?.height);
            const weight = Number(item.delivery_order_list?.weight);
            const qty = Number(item.delivery_order_list?.qty_box);
            const cbmPerUnit = (item?.delivery_order_list.long * width * height) / 1000000;
            const totalCBM = cbmPerUnit * qty;
            const totalWeight = weight * qty;
            const statusCounts = {
                total: 0,
                in: 0,
                wait: 0,
                out: 0
            };

            return {
                ...item,
                cbmPerUnit: cbmPerUnit.toFixed(4),
                totalCBM: totalCBM.toFixed(4),
                totalWeight: totalWeight.toFixed(4)
            };
        });

        // this._service.getPackingListById(this.Id).subscribe((res: any) => {
        //     this.packingListData = res.data;
        // })

        this.filterForm
            .get('in_store')
            .valueChanges.pipe(debounceTime(500))
            .subscribe((value) => {
                if (this.filterForm.get('in_store').value !== null) {
                    this.filteredDeliveryOrders =
                        this.data?.delivery_orders.filter((order) =>
                            order.delivery_order.code.includes(value)
                        );
                }
            });
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

    Close() {
        this._router.navigate(['pallet']);
    }

    filterForm: FormGroup;
    formThai: FormGroup;
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filteredDeliveryOrders = this.data?.delivery_orders;
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders = this.data?.delivery_orders.filter(
            (order) => {
                return (
                    (!code || order.delivery_order.code.includes(code)) &&
                    (!member_id ||
                        order.delivery_order.member_id.includes(member_id)) &&
                    (!sack_code ||
                        order.delivery_order.sack_code.includes(sack_code))
                );
            }
        );
    }

    clearFilter() {
        this.filterForm.reset();
        this.filteredDeliveryOrders = this.data?.delivery_orders;
    }
    selectMember(event: any) {
        this.filterForm.patchValue({
            member_id: event.id,
        });
    }
    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: this.translocoService.translate(
                'confirmation.delete_title2'
            ),
            message: this.translocoService.translate(
                'confirmation.delete_message2'
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
                this._service.delete(this.Id).subscribe({
                    error: (err) => {
                        this.toastr.error(
                            this.translocoService.translate(
                                'toastr.delete_fail'
                            )
                        );
                    },
                    complete: () => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.delete')
                        );
                        this._router.navigate(['pallet']);
                    },
                });
            }
        });
    }
    opendialogqrcode() {
        const DialogRef = this.dialog.open(DialogQRCodeComponent, {
            disableClose: true,
            width: '400px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                text: this.data?.code,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(this.lists, 'lists');
            }
        });
    }
    get totallist() {
        return this.data?.delivery_order_list_items.length ?? 0;
    }
    get totalWeight() {
        return this.filteredDeliveryOrders
            .reduce(
                (total, item) =>
                    total +
                    (isNaN(Number(item.totalWeight)) ? 0 : Number(item.totalWeight)),
                0
            )
            .toFixed(4);
    }
    get totalCBM() {
        return this.filteredDeliveryOrders
            .reduce(
                (total, item) =>
                    total + (isNaN(Number(item.totalCBM)) ? 0 : Number(item.totalCBM)),
                0
            )
            .toFixed(4);
    }

    sackedit() {
        this._router.navigate(['/sack/edit/' + this.Id]);
    }

    opendialoglist() {
        const DialogRef = this.dialog.open(DialogPoComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                type: '',
                id: this.Id,
                items: this.data?.delivery_order_list_items
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (Array.isArray(result)) {
                const today = DateTime.local().toFormat('yyyy-MM-dd');
                this.formThai.patchValue({
                    date: today,
                    packing_list_id: this.Id,
                })
                result.forEach((item) => {
                    this.orderLists.push(this.FormBuilder.group({
                        delivery_order_id: item.delivery_order_id,
                        delivery_order_list_id: item.delivery_order_list_id,
                        delivery_order_list_item_id: item.id,
                    }));
                });
                this._service.addItemToThaiStore(this.formThai.value).subscribe({
                    next: (resp: any) => {
                        this.toastr.success(this.translocoService.translate('toastr.success'));
                        this._service.getPackingListById(this.Id).subscribe((res: any) => {
                            this.data = res.data;
                            this.ngOnInit();
                        });
                    },
                    error: (err) => {
                        this.toastr.error(this.translocoService.translate('toastr.error'));
                    },
                });
            }
        });
    }

    get orderLists(): FormArray {
        return this.formThai.get('order_lists') as FormArray;
    }

    findLatestDepartedChina(logs: any[]): any | null {
        if (!Array.isArray(logs) || logs.length === 0) {
            return null;
        }

        const departedLogs = logs
            .filter(log => log?.status === 'departed_china' && log?.created_at)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return departedLogs.length > 0
            ? DateTime.fromISO(departedLogs[0].created_at).toFormat('yyyy-MM-dd')
            : '-';
    }

    findLatestArrivedThailand(logs: any[]): string | null {
        if (!Array.isArray(logs) || logs.length === 0) {
            return null;
        }

        const arrivedLogs = logs
            .filter(log => log?.status === 'arrived_thailand' && log?.created_at)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return arrivedLogs.length > 0 ? arrivedLogs[0].created_at : '-';
    }

    convertProductType(data: any) {
        const productType = this.product_types.find(
            (type) => type.id === data
        );
        return productType ? productType.name : '';
    }

    convertStore(data: any) {
        const item = this.store.find(
            (store) => store.id === data
        );
        return item ? item.name : '';
    }
    convertMember(data: any) {
        const item = this.member.find(
            (store) => store.id === +data
        );
        return item ? item.importer_code : '';
    }

    calculateCBMAndWeight(item: any) {
        const long = Number(item.long);
        const width = Number(item.width);
        const height = Number(item.height);
        const weight = Number(item.weight);
        const qty = item.qty_box;

        const cbmPerUnit = (long * width * height) / 1000000; // cm³ → m³
        const totalCBM = cbmPerUnit * qty;
        const totalWeight = weight * qty;

        return {
            cbmPerUnit: cbmPerUnit.toFixed(4),   // ทศนิยม 6 ตำแหน่ง
            totalCBM: totalCBM.toFixed(4),
            totalWeight: totalWeight.toFixed(4)  // ทศนิยม 2 ตำแหน่ง
        };
    }

    convertPathImage(url: any) {
        return environment.apiUrl + '/' + url
    }

    openScanDialog(): void {
        const DialogRef = this.dialog.open(BarcodeDialogComponent, {
            disableClose: true,
            width: '50%',
            maxHeight: '90vh',
            data: this.data
        });
        DialogRef.afterClosed().subscribe((result) => {
            this._service.getPackingListById(this.Id).subscribe((res: any) => {
                this.data = res.data;

                this.ngOnInit();
            });
        });
    }

    getPackingNo(packingId: any) {
        const packing = this.packingList.find((item: any) => item.id === packingId);
        return packing || null;
    }
    countInStatus(): number {
        return this.data?.delivery_order_list?.delivery_order_list_items?.filter(
            (item: any) => item.status === 'in'
        ).length || 0;
    }

    openPoBox(data: any) {
        console.log(data.delivery_order_list?.delivery_order_list_items, 'data');
        const DialogRef = this.dialog.open(DialogPoBoxComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: data
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'lists');
            }
        });
    }

    CountInThailand(data: any) {
        return data?.delivery_order_list?.delivery_order_list_items?.filter(
            (item: any) => item.status === 'out'
        ).length || 0;
    }
    CountByPackingListId(data: any, id: number): number {
        return (
            data?.delivery_order_list?.delivery_order_list_items?.filter(
                (item: any) => item.packing_list_id === id
            ).length || 0
        );
    }

    coutnProgress(data:any) {
        const countdata = data.delivery_order_list.total_all - data.delivery_order_list.total_out_packing_lists
        return countdata || 0;
    }
}
