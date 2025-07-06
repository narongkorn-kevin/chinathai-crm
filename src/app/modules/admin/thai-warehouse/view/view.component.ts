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
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { WarehouseService } from '../warehouse.service';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { DialogQRCodeComponent } from 'app/modules/common/dialog-qrcode/dialog-qrcode.component';
import { debounceTime } from 'rxjs/operators';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogPoComponent } from '../dialog-po/dialog-po.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgressBarComponent } from 'app/modules/common/progress-bar/progress-bar.component';

@Component({
    selector: 'app-member-view-1',
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
    ProgressBarComponent
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
        public _service: WarehouseService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog,
    ) {
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data?.data?.data;
    }
    ngOnInit(): void {
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            in_store: [''],
            code: [''],
            sack_code: [''],
        });
        this.filteredDeliveryOrders = this.data?.delivery_orders;

        this.filterForm.get('in_store').valueChanges.pipe(
            debounceTime(500)
        ).subscribe(value => {
            if(this.filterForm.get('in_store').value !== null) {
                this.filteredDeliveryOrders = this.data?.delivery_orders.filter(order =>
                    order.delivery_order.code.includes(value)
                );
            }
        });

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
        this.filteredDeliveryOrders = this.data?.delivery_orders;
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders = this.data?.delivery_orders.filter(order => {
            return (!code || order.delivery_order.code.includes(code)) &&
                   (!member_id || order.delivery_order.member_id.includes(member_id)) &&
                   (!sack_code || order.delivery_order.sack_code.includes(sack_code));
        });
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
    get totallist() {
        return this.data?.delivery_orders.length;
    }
    get totalWeight() {
        return this.data?.delivery_orders
            .reduce((total, item) => total + (isNaN(Number(item.weight)) ? 0 : Number(item.weight)), 0)
            .toFixed(2);
    }
    get totalCBM() {
        return this.data?.delivery_orders
            .reduce((total, item) => total + (isNaN(Number(item.cbm)) ? 0 : Number(item.cbm)), 0)
            .toFixed(2);
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
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(this.lists, 'lists');

            }
        });
    }
}
