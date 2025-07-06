import { DeliveryService } from './../../stock/delivery/delivery.service';
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
import { DialogEditPriceComponent } from '../dialog-edtr-price/dialog-edit-price.component';

@Component({
    selector: 'app-invoice-view',
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
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    lists = [];
    filteredDeliveryOrders: any[] = [{delivery_order:'test'}]; // Add a new property to store filtered delivery orders

    constructor(
        private FormBuilder: FormBuilder,
        public _service: DeliveryService,
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
        });
        this.filteredDeliveryOrders = this.data.delivery_orders;

        this.filterForm.get('in_store').valueChanges.pipe(
            debounceTime(500)
        ).subscribe(value => {
            if(this.filterForm.get('in_store').value !== null) {
                this.filteredDeliveryOrders = this.data.delivery_orders.filter(order =>
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


    filterForm: FormGroup;
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
        this.filteredDeliveryOrders = this.data.delivery_orders;
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders = this.data.delivery_orders.filter(order => {
            return (!code || order.delivery_order.code.includes(code)) &&
                   (!member_id || order.delivery_order.member_id.includes(member_id)) &&
                   (!sack_code || order.delivery_order.sack_code.includes(sack_code));
        });
    }

    clearFilter() {
        this.filterForm.reset();
        this.filteredDeliveryOrders = this.data.delivery_orders;
    }

    edit() {
        this._router.navigate(['/invoice/edit/' + this.Id]);
    }
    print(){
        console.log('print');
    }

    opendialogeditprice(){
       const DialogRef = this.dialog.open(DialogEditPriceComponent, {
            disableClose: true,
            width: '50%',
            maxHeight: '90vh',
            enterAnimationDuration: 300,
            exitAnimationDuration: 300,
            data: {

            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result');
                // this.rerender();
            }
        });
    }
}
