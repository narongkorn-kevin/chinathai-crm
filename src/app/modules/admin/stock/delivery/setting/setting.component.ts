import { CdkMenuModule } from '@angular/cdk/menu';
import { Subject, Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
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
import { DeliveryService } from '../delivery.service';
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
import {
    MatProgressBar,
    MatProgressBarModule,
} from '@angular/material/progress-bar';
import { DialogSettingComponent } from '../dialog-setting/dialog-setting.component';
import { ADTSettings } from 'angular-datatables/src/models/settings';

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
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
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
export class SettingComponent implements OnInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    type: string;
    Id: number;
    data: any;
    lists = [];
    OrderShipment = [];
    filteredDeliveryOrders: any[] = [];
    Form: FormGroup;
    public chartOptions: Partial<ChartOptions> = {};

    constructor(
        private FormBuilder: FormBuilder,
        public _service: DeliveryService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data?.data;
        this.OrderShipment = this.activated.snapshot.data.OrderShipment?.data;
    }
    ngOnInit(): void {}

    getShipmentMethod(shippedBy: string): string {
        if (shippedBy === 'Car') {
            return 'ทางรถ';
        } else if (shippedBy === 'Ship') {
            return 'ทางเรือ';
        } else if (shippedBy === 'Train') {
            return 'ทางรถไฟ';
        } else {
            return '-';
        }
    }

    Close() {
        this._router.navigate(['delivery']);
    }

    filterForm: FormGroup;
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filteredDeliveryOrders = this.data.delivery_orders;
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders = this.data.delivery_orders.filter(
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
        this.filteredDeliveryOrders = this.data.delivery_orders;
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

    opendialogsetting() {
        const DialogRef = this.dialog.open(DialogSettingComponent, {
            disableClose: true,
            width: '80%',
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
        return this.data.delivery_orders.length;
    }
    get totalWeight() {
        return this.data.delivery_orders
            .reduce(
                (total, item) =>
                    total +
                    (isNaN(Number(item.weight)) ? 0 : Number(item.weight)),
                0
            )
            .toFixed(2);
    }
    get totalCBM() {
        return this.data.delivery_orders
            .reduce(
                (total, item) =>
                    total + (isNaN(Number(item.cbm)) ? 0 : Number(item.cbm)),
                0
            )
            .toFixed(2);
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
        // const listArray = this.listArray;
        // this.lists.forEach((item, index) => {
        //     listArray.at(index).get('IsChecked').setValue(item.IsChecked);
        // });
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
}
