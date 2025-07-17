import { CdkMenuModule } from '@angular/cdk/menu';
import { Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    OnChanges,
    Inject,
    ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
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
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    Validators,
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
import { LotService } from '../lot.service';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogQRCodeComponent } from 'app/modules/common/dialog-qrcode/dialog-qrcode.component';
import { debounceTime } from 'rxjs/operators';
import {
    ApexAxisChartSeries,
    ApexNonAxisChartSeries,
    ApexChart,
    ApexResponsive,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexStroke,
    ApexLegend,
    NgApexchartsModule,
    ChartComponent,
} from 'ng-apexcharts';
import {
    MatProgressBar,
    MatProgressBarModule,
} from '@angular/material/progress-bar';
import { PaginationComponent } from 'app/modules/common/pagination/pagination.component';
import { MatPaginatorModule } from '@angular/material/paginator';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    n_series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    colors: string[];
};
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-member-view-draft',
    standalone: true,
    templateUrl: './view-draft.component.html',
    styleUrl: './view-draft.component.scss',
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
        MatRadioModule,
        MatDatepickerModule,
        MatDivider,
        RouterLink,
        SelectMemberComponent,
        CdkMenuModule,
        MatCheckboxModule,
        NgApexchartsModule,
        MatProgressBarModule,
        PaginationComponent,
        MatPaginatorModule,
    ],
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
export class ViewDraftComponent implements OnInit {
    sumdashbord = {
        total_items: 100,
        categories: [
            { name: 'ประเภท A', boxes: 0, cbm: 0 },
            { name: 'ประเภท B', boxes: 0, cbm: 0 },
            { name: 'ประเภท C', boxes: 0, cbm: 0 },
            { name: 'ประเภท D', boxes: 0, cbm: 0 },
            { name: 'ประเภท CB', boxes: 0, cbm: 0 },
            { name: 'ประเภท CD', boxes: 0, cbm: 0 },
            { name: 'ประเภท CF', boxes: 0, cbm: 0 },
        ],
        summary: {
            total_orders: 0,
            total_cbm: 0,
            total_weight_kg: 0,
        },
    };
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    delivery_orders: any[] = [];
    Id: number;
    data: any;
    lists = [];
    filteredDeliveryOrders: any[] = [];
    form: FormGroup;
    public chartOptions: Partial<ChartOptions> = {};

    currentPage: number = 1;
    itemsPerPage: number = 20;

    constructor(
        private FormBuilder: FormBuilder,
        public _service: LotService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data?.data;
        this.delivery_orders =
            this.activated.snapshot.data.delivery_orders?.data;
        if (this.delivery_orders) {
            this.delivery_orders.forEach((order) => {
                order.IsChecked = false;
            });
        }
    }
    ngOnInit(): void {
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            start_date: [''],
            end_date: [''],
            in_store: [''],
            code: [''],
            sack_code: [''],
            type: [''],
            trans_by: [''],
        });
        this.form = this.FormBuilder.group({
            order: this.FormBuilder.array([]),
        });
        this.filteredDeliveryOrders = this.delivery_orders;
        this.updateDisplayedItems();

        this.filterForm
            .get('in_store')
            .valueChanges.pipe(debounceTime(500))
            .subscribe((value) => {
                if (this.filterForm.get('in_store').value !== null) {
                    this.filteredDeliveryOrders = this.delivery_orders.filter(
                        (order) => order.delivery_order.code.includes(value)
                    );
                }
            });

        this.updateChartOptions();
    }
    updateChartOptions(): void {
        this.chartOptions = {
            n_series: [...this.sumdashbord.categories.map((cat) => cat.cbm)],
            chart: {
                type: 'donut',
                height: 400,
                width: '100%',
            },
            labels: [...this.sumdashbord.categories.map((cat) => cat.name)],
            colors: [
                '#FF0000',
                '#CC0000',
                '#990000',
                '#660000',
                '#330000',
                '#FF6666',
                '#FF9999',
            ],
            legend: {
                show: false,
            },
            dataLabels: {
                enabled: false,
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            width: '100%',
                            height: 250,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        // บังคับให้ Angular ตรวจจับการเปลี่ยนแปลง
        this._changeDetectorRef.detectChanges();
    }
    get orderArray(): FormArray {
        return this.form.get('order') as FormArray;
    }
    createorder(data?: any): FormGroup {
        return this.FormBuilder.group({
            id: [data?.id || ''],
        });
    }
    removeorder(index: number): void {
        this.orderArray.removeAt(index);
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
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filteredDeliveryOrders = this.data.delivery_orders;
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders = this.delivery_orders.filter((order) => {
            return (
                (!code || order.delivery_order.code.includes(code)) &&
                (!member_id ||
                    order.delivery_order.member_id.includes(member_id)) &&
                (!sack_code ||
                    order.delivery_order.sack_code.includes(sack_code))
            );
        });
        this.currentPage = 1;
        this.updateDisplayedItems();
    }

    clearFilter() {
        this.filterForm.reset();
        this.filteredDeliveryOrders = this.delivery_orders;
    }
    selectMember(event: any) {
        this.filterForm.patchValue({
            member_id: event.id,
        });
    }

    selectAll: boolean = false;

    someSelect(): boolean {
        if (this.delivery_orders == null) {
            return false;
        }
        return (
            this.delivery_orders.filter((t) => t.IsChecked).length > 0 &&
            !this.selectAll
        );
    }

    clearSelection() {
        this.delivery_orders.forEach((item) => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.delivery_orders.forEach(
            (item) => (item.IsChecked = this.selectAll)
        );
        this.filteredDeliveryOrders.forEach(
            (item) => (item.IsChecked = this.selectAll)
        );

        this.updateSummaryData();
        this.updateChartOptions();
    }

    updateAllselect() {
        this.selectAll =
            this.delivery_orders != null &&
            this.delivery_orders.every((t) => t.IsChecked);
        this.updateSummaryData();
        this.updateChartOptions();
    }

    updateSummaryData() {
        // อัปเดตค่าสรุปน้ำหนักและปริมาตร
        this.sumdashbord.summary.total_cbm = parseFloat(this.totalCbm);
        this.sumdashbord.summary.total_weight_kg = parseFloat(this.totalWeight);

        // รีเซ็ตค่าหมวดหมู่
        this.sumdashbord.categories.forEach((category) => {
            category.boxes = 0;
            category.cbm = 0;
        });

        // อัปเดตหมวดหมู่ตามรายการที่เลือก
        this.delivery_orders
            .filter((order) => order.IsChecked)
            .forEach((order) => {
                const category = this.sumdashbord.categories.find(
                    (cat) => cat.name === order.product_type.name
                );
                if (category) {
                    category.boxes += order.qty;
                    category.cbm += parseFloat(
                        order.total_box_cbm || order.total_cbm || 0
                    );
                }
            });
    }

    get seletedList() {
        return (
            this.lists != null &&
            this.lists.filter((t) => t.IsChecked).map((e) => e.id)
        );
    }

    lotedit() {
        this._router.navigate(['/lot/edit/' + this.Id]);
    }
    sacnpo() {
        this._router.navigate(['/lot/scan-po/' + this.Id]);
    }
    draft() {
        this._router.navigate(['/lot/draft/' + this.Id]);
    }

    onPageChange(event: { page: number; itemsPerPage: number }): void {
        this.currentPage = event.page;
        this.itemsPerPage = event.itemsPerPage;
        this.updateDisplayedItems();
    }

    updateDisplayedItems(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        this.filteredDeliveryOrders = this.delivery_orders.slice(
            startIndex,
            endIndex
        );
    }

    get totalWeight() {
        return this.delivery_orders
            .filter((order) => order.IsChecked)
            .reduce((total, product) => total + Number(product.weight || 0), 0)
            .toFixed(4);
    }

    get totalCbm() {
        return this.delivery_orders
            .filter((order) => order.IsChecked)
            .reduce(
                (total, product) => total + Number(product.total_cbm || 0),
                0
            )
            .toFixed(4);
    }
}
