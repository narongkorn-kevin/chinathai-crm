import { DeliveryService } from '../../stock/delivery/delivery.service';
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
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { DialogPoComponent } from '../dialog-po/dialog-po.component';
import { DialogTrackingComponent } from '../dialog-tracking/dialog-tracking.component';
import { UploadImageComponent } from 'app/modules/common/upload-image/upload-image.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-delivery-note-view-order-after-1',
    standalone: true,
    templateUrl: './view-order-after.component.html',
    styleUrl: './view-order-after.component.scss',
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
        UploadFileComponent,
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
export class ViewOrderAfterComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    lists = [];
    filteredDeliveryOrders: any[] = [];
    filteredOut: any[] = [];
    filteredtracking: any[] = [];
    Form: FormGroup;

    status_type: string;

    constructor(
        private translocoService: TranslocoService,
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
        // this.status_type = this.activated.snapshot.data.data?.status_type;
        this.status_type = 'send';
        // this.status_type = 'pick';
    }
    ngOnInit(): void {
        this.Form = this.FormBuilder.group({
            customerCode: [''],
            warehouseDate: [''],
            note: [''],
            fullName: [''],
            driverPhone: [''],
            licenseNumber: [''],
            carRegistration: [''],
            shippedBy: [''],
            area: [''],
        });

        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            in_store: [''],
            code: [''],
            sack_code: [''],
        });
        this.filteredDeliveryOrders = this.data?.delivery_orders;

        this.filterForm
            .get('in_store')
            .valueChanges.pipe(debounceTime(500))
            .subscribe((value) => {
                if (this.filterForm.get('in_store').value !== null) {
                    this.filteredDeliveryOrders =
                        this.data.delivery_orders.filter((order) =>
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

    close() {
        this._router.navigate(['/delivery-note']);
    }
    edit() {
        this._router.navigate(['/delivery-note/view-order/' + this.Id]);
    }
    opendialogpo() {
        const DialogRef = this.dialog.open(DialogPoComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {},
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
            }
        });
    }
    opendialogtracking() {
        const DialogRef = this.dialog.open(DialogTrackingComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {},
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
            }
        });
    }
    opendialogimage(title: string) {
        const DialogRef = this.dialog.open(UploadImageComponent, {
            disableClose: true,
            width: '80%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {
                title: title,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
            }
        });
    }
}
