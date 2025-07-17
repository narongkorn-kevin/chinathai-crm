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
import { SackService } from '../sack.service';
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

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { calculateCBM } from 'app/helper';

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
    filteredDeliveryOrders: any[] = []; // Add a new property to store filtered delivery orders
    productType: any[] = [];
    members: any[] = [];
    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: SackService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data?.data;
        this._service.getProductType().subscribe({
            next: (res: any) => {
                if (res) {
                    this.productType = res.data;
                } else {
                    this.toastr.error(
                        this.translocoService.translate('toastr.error')
                    );
                }
            }

        })
        this._service.getMember().subscribe((resp: any) => {
            this.members = resp.data;
        })

        this.data.sack_lists.forEach((item) => {
            item.delivery_order_list.cbm = calculateCBM(
                +item.delivery_order_list.width,
                +item.delivery_order_list.height,
                +item.delivery_order_list.long
            );
        });
    }
    ngOnInit(): void {
        this.filterForm = this.FormBuilder.group({
            member_id: [''],
            in_store: [''],
            code: [''],
            sack_code: [''],
        });
        this.filteredDeliveryOrders = this.data.sack_lists;
        console.log(this.filteredDeliveryOrders, 'filteredDeliveryOrders');

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
            title: this.translocoService.translate(
                'confirmation.delete_title2'
            ),
            message:
                this.translocoService.translate('confirmation.delete_message2'),
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
        return this.data.sack_lists.length;
    }
    get totalWeight() {
        return this.data.sack_lists
            .reduce(
                (total, item: any) =>
                    total +
                    (isNaN(Number(item.delivery_order_list?.weight))
                        ? 0
                        : Number(item.delivery_order_list?.weight)),
                0
            )
            .toFixed(4);
    }
    get totalCBM() {
        return this.data.sack_lists
            .reduce(
                (total, item: any) =>
                    total +
                    (isNaN(Number(item.delivery_order_list?.cbm))
                        ? 0
                        : Number(item.delivery_order_list?.cbm)),
                0
            )
            .toFixed(4);
    }

    sackedit() {
        this._router.navigate(['/sack/edit/' + this.Id]);
    }

    checkProductType(data: any) {
        const productType = this.productType.find(
            (item: any) => item.id === +data)
        return productType?.name || '-';
    }

    findMemberName(memberId: any): string {
        const member = this.members.find((m) => m.id === +memberId);
        return member ? member.importer_code : '-';
    }
}
