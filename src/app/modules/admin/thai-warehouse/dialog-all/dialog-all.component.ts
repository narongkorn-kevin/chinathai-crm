import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WarehouseService } from '../warehouse.service';
import { MatDivider } from '@angular/material/divider';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import {
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-thai-warehouse-dialog-all',
    standalone: true,
    templateUrl: './dialog-all.component.html',
    styleUrl: './dialog-all.component.scss',
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
        MatCheckboxModule,
        MatDivider,
        MatDatepickerModule,
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
    providers: [DatePipe],
})
export class DialogAllComponent implements OnInit {
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    tracks = [];
    packing_list = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogAllComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        private _service: WarehouseService,
        private datePipe: DatePipe
    ) {
        this.form = this.FormBuilder.group({
            packing_list_id: [''],
        });
    }

    ngOnInit(): void {
        this._service.getPackingListNotThai().subscribe((res: any) => {
            this.packing_list = res.data;
        });
    }
    ngAfterViewInit() {}

    ngOnDestroy(): void {}

    Submit() {
        if (this.form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.form.markAllAsTouched();
            return;
        }
        const packingListId = this.form.get('packing_list_id').value;
        const selectedPackingList = this.packing_list.find(
            (item) => item.id === packingListId
        );

        if (!selectedPackingList) {
            this.toastr.error(
                this.translocoService.translate('toastr.select_packing_list')
            );
            return;
        }
        if (
            !selectedPackingList.packling_list_order_lists ||
            selectedPackingList.packling_list_order_lists.length === 0
        ) {
            this.toastr.error(
                this.translocoService.translate('toastr.no_products_found')
            );
            return;
        }
        const formValue = {
            date: this.formatDate(new Date()),
            packing_list_id: packingListId,
            order_lists: selectedPackingList.packling_list_order_lists.map(
                (item) => ({
                    delivery_order_id: item.delivery_order_id,
                    delivery_order_list_id: item.delivery_order_list_id,
                })
            ),
        };

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
                this._service.deliveryOrdersThai(formValue).subscribe({
                    next: (resp: any) => {
                        this.toastr.success(
                            this.translocoService.translate(
                                'toastr.add'
                            )
                        );
                    },
                    error: (err) => {
                        this.toastr.error(
                            this.translocoService.translate(
                                'toastr.add_error'
                            )
                        );
                    },
                });
                this.dialogRef.close(formValue);
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd', 'Asia/Bangkok');
    }
}
