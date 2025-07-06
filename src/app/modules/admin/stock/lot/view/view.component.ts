import { CdkMenuModule } from '@angular/cdk/menu';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject } from '@angular/core';
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
} from 'ng-apexcharts';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarComponent } from 'app/modules/common/progress-bar/progress-bar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { UploadImageComponent } from 'app/modules/common/upload-image/upload-image.component';
import { DialogUpdateStatusComponent } from 'app/modules/common/dialog-update-status/dialog-update-status.component';
import { DialogViewImageComponent } from 'app/modules/common/dialog-view-image/dialog-view-image.component';

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
@Component({
    selector: 'app-member-setting',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    imports: [
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
    ProgressBarComponent,
    MatTabsModule,
    ProgressBarComponent
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
export class ViewComponent implements OnInit {
    sumdashbord = {
        total_items: 100,
        categories: [
            { name: 'ประเภท A', boxes: 99, cbm: 100 },
            { name: 'ประเภท B', boxes: 99, cbm: 100 },
            { name: 'ประเภท C', boxes: 99, cbm: 100 },
            { name: 'ประเภท D', boxes: 99, cbm: 100 },
            { name: 'ประเภท CB', boxes: 99, cbm: 100 },
            { name: 'ประเภท CD', boxes: 99, cbm: 100 },
            { name: 'ประเภท CF', boxes: 99, cbm: 100 },
        ],
        summary: {
            total_orders: 1870,
            total_cbm: 1870,
            total_weight_kg: 1870,
            transport_truck: 1870,
            transport_ship: 1870,
        },
    };
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    lists = [];
    filteredDeliveryOrders: any[] = [];
    images: any[] = [];
    Form: FormGroup;
    public chartOptions: Partial<ChartOptions> = {

    };
    selectedTabIndex: number = 0;

    timelineData = [
        { id: "01", text: "รับเข้าคลัง", user: "testcargo", date: "2024-08-10", time: "01:35", status: true },
        { id: "02", text: "ขึ้นพาเลท", user: "testcargo", date: "2024-08-10", time: "01:35", status: true },
        { id: "03", text: "พัสดุเดินทางจากโกดังจีนไปหน้าด่าน", user: "testcargo", date: "2024-08-10", time: "01:35", status: true },
        { id: "04", text: "จองตู้", user: "", date: "", time: "", status: false },
        { id: "05", text: "ปิดตู้", user: "", date: "", time: "", status: false },
        { id: "06", text: "ดำเนินพิธีศุลกากรต้นทางจีน", user: "", date: "", time: "", status: false, hasButton: true },
        { id: "07", text: "ติดตรวจปล่อยพิธีศุลกากรต้นทางจีน", user: "", date: "", time: "", status: false },
        { id: "08", text: "พัสดุเดินทางระหว่าง จีน-ไทย", user: "", date: "", time: "", status: false },
        { id: "09", text: "ดำเนินพิธีศุลกากรปลายทางไทย", user: "", date: "", time: "", status: false, hasButton: true },
        { id: "10", text: "พัสดุถึงโกดัง", user: "", date: "", time: "", status: false },
        { id: "11", text: "พัสดุถึงลูกค้าปลายทาง", user: "", date: "", time: "", status: false },
        { id: "12", text: "พัสดุถึงลูกค้าปลายทางเรียบร้อย", user: "", date: "", time: "", status: false },
        { id: "13", text: "ปิดตู้", user: "", date: "", time: "", status: false },
      ];

    constructor(
        private FormBuilder: FormBuilder,
        public _service: LotService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog,
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data?.data;
    }
    ngOnInit(): void {
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            in_store: [''],
            code: [''],
            sack_code: [''],
            start_date: [''],
            end_date: [''],
        });
        this.filteredDeliveryOrders = this.data.packling_list_order_lists;

        this.filterForm.get('in_store').valueChanges.pipe(
            debounceTime(500)
        ).subscribe(value => {
            if(this.filterForm.get('in_store').value !== null) {
                this.filteredDeliveryOrders = this.data.packling_list_order_lists.filter(order =>
                    order.delivery_order.code.includes(value)
                );
            }
        });

        this.chartOptions = {
            n_series: this.sumdashbord?.categories.map((cat) => cat.cbm),
            chart: {
                type: 'donut',
                height: 400, // เพิ่มขนาดของกราฟให้สูงขึ้น
                width: '100%', // ขยายความกว้างของกราฟ
            },
            labels: this.sumdashbord?.categories.map((cat) => cat.name),
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
                show: false, // ซ่อน Legend ของกราฟ
            },
            dataLabels: {
                enabled: false, // ซ่อนค่าบนกราฟ
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
    }

    getShipmentMethod(shippedBy: string): string {
        if (shippedBy === 'Car') {
            return 'ขนส่งทางรถ';
        } else if (shippedBy === 'Ship') {
            return 'ขนส่งทางเรือ';
        } else if (shippedBy === 'Train') {
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
        this.filteredDeliveryOrders = this.data.packling_list_order_lists;
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders = this.data.packling_list_order_lists.filter(order => {
            return (!code || order.delivery_order.code.includes(code)) &&
                   (!member_id || order.delivery_order.member_id.includes(member_id)) &&
                   (!sack_code || order.delivery_order.sack_code.includes(sack_code));
        });
    }

    clearFilter() {
        this.filterForm.reset();
        this.filteredDeliveryOrders = this.data.packling_list_order_lists;
    }
    selectMember(event: any) {
        this.filterForm.patchValue({
            member_id: event.id,
        });
    }
    opendialogdelete() {
        const confirmation = this.fuseConfirmationService.open({
            title: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการ?',
            message:
                'คุณกำลังจะ ลบรายการ หากกดยืนยันแล้วจะไม่สามารถเอากลับมาอีกได้',
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
                this._service.delete(this.Id).subscribe({
                    error: (err) => {
                        this.toastr.error('ไม่สามารถลบข้อมูลได้');
                    },
                    complete: () => {
                        this.toastr.success('ดำเนินการลบข้อมูลสำเร็จ');
                        this._router.navigate(['pallet']);
                    },
                });
            }
        });
    }
    opendialogphoto() {
        const DialogRef = this.dialog.open(UploadImageComponent, {
            disableClose: true,
            width: '60%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                title: 'เพิ่มรูปสินค้า',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(this.lists, 'lists');

            }
        });
    }
    opendialogqrcode(){
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
    opendialogviewimage(){
        const DialogRef = this.dialog.open(DialogViewImageComponent, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                images: [
                    { file: null, name: 'Image 1', size: 1234, imagePreview: 'https://picsum.photos/500/300?random=1' },
                    { file: null, name: 'Image 2', size: 1234, imagePreview: 'https://picsum.photos/500/300?random=2' },
                    { file: null, name: 'Image 3', size: 1234, imagePreview: 'https://picsum.photos/500/300?random=3' },
                    { file: null, name: 'Image 4', size: 1234, imagePreview: 'https://cargo-api.dev-asha9.com/images/asset/08f78b444a30772fd597a7c23620ee9b.png' }
                ]
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
            }
        });
    }
    get totallist() {
        return this.data.delivery_orders.length;
    }
    get totalWeight() {
        return this.data.delivery_orders
            .reduce((total, item) => total + (isNaN(Number(item.weight)) ? 0 : Number(item.weight)), 0)
            .toFixed(2);
    }
    get totalCBM() {
        return this.data.delivery_orders
            .reduce((total, item) => total + (isNaN(Number(item.cbm)) ? 0 : Number(item.cbm)), 0)
            .toFixed(2);
    }

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
        // const listArray = this.listArray;
        // this.lists.forEach((item, index) => {
        //     listArray.at(index).get('IsChecked').setValue(item.IsChecked);
        // });
    }
    get seletedList() {
        return this.lists != null && this.lists.filter(t => t.IsChecked).map(e => e.id);
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

    onTabChange(event: any): void {
        this.selectedTabIndex = event.index;
    }

    opendialogstatus() {
        const DialogRef = this.dialog.open(DialogUpdateStatusComponent, {
            disableClose: true,
            width: '500px',
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
}
