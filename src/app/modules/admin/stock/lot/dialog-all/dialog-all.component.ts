import {
    Component,
    OnInit,
    Inject,
    ViewChild,
    HostListener,
} from '@angular/core';
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
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
    FormArray,
    FormControl,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
import { LotService } from '../lot.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-lot-dialog-all',
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
        MatFormFieldModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDivider,
        MatDatepickerModule,
        MatAutocompleteModule,
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
export class DialogAllComponent implements OnInit {
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    tracks = [];

    isScreenSmall: boolean;

    packinglistFilter = new FormControl('');
    filterpackinglist: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    newPackinglistFilter = new FormControl('');
    filterNewPackinglist: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    packing_list: any[] = [];

    from_packing_list_id: number;
    to_packing_list_id: number;
    delivery_order_lists: any[] = [];

    constructor(
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<DialogAllComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private FormBuilder: FormBuilder,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private http: HttpClient,
        private _service: LotService
    ) {
        this.packing_list = this.data.packing_list;
        this.filterpackinglist.next(this.packing_list.slice());
        this.filterNewPackinglist.next(this.packing_list.slice());
    }
    protected _onDestroy = new Subject<void>();

    ngOnInit(): void {
        this.packinglistFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterpackinglist();
            });
        this.newPackinglistFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterNewPackinglist();
            });

        this.checkScreenSize();
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
        const formValue = {
            from_packing_list_id: this.from_packing_list_id,
            to_packing_list_id: this.to_packing_list_id,
            delivery_order_lists: this.delivery_order_lists.map((order) => ({
                delivery_order_id: order.delivery_order_id,
                delivery_order_list_id: order.delivery_order_list_id,
            })),
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
                this._service.changePackingList(formValue).subscribe({
                    next: (resp: any) => {
                        this.toastr.success(
                            this.translocoService.translate('toastr.success')
                        );
                        this.dialogRef.close();
                    },
                    error: (error) => {
                        this.toastr.error(
                            this.translocoService.translate(
                                'toastr.error_occurred'
                            )
                        );
                        console.log(error);
                    },
                });
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    protected _filterpackinglist() {
        if (!this.packing_list) {
            return;
        }
        let search = this.packinglistFilter.value;

        if (!search) {
            this.filterpackinglist.next(this.packing_list.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }

        this.filterpackinglist.next(
            this.packing_list.filter((item) =>
                item.code.toLowerCase().includes(search)
            )
        );
    }

    protected _filterNewPackinglist() {
        if (!this.packing_list) {
            return;
        }
        let search = this.newPackinglistFilter.value;

        if (!search) {
            this.filterNewPackinglist.next(this.packing_list.slice());
            return;
        } else {
            search = search.toString().toLowerCase();
        }

        this.filterNewPackinglist.next(
            this.packing_list.filter((item) =>
                item.code.toLowerCase().includes(search)
            )
        );
    }

    onSelectpackinglist_main(event: any) {
        if (!event) {
            if (this.packinglistFilter.invalid) {
                this.packinglistFilter.markAsTouched();
            }
            return;
        }

        const selectedData = event;

        if (selectedData) {
            this.from_packing_list_id = selectedData.id;
            this._service.get(selectedData.id).subscribe((data: any) => {
                this.delivery_order_lists = data.data.packling_list_order_lists;
            });

            this.packinglistFilter.setValue(`${selectedData.code}`);
        } else {
            if (this.packinglistFilter.invalid) {
                this.packinglistFilter.markAsTouched();
            }
            console.log('No packing list Found');
            return;
        }
    }

    onSelectpackinglist(event: any) {
        if (!event) {
            if (this.newPackinglistFilter.invalid) {
                this.newPackinglistFilter.markAsTouched();
            }
            return;
        }

        const selectedData = event;

        if (selectedData) {
            this.to_packing_list_id = selectedData.id;

            if (this.to_packing_list_id === this.from_packing_list_id) {
                this.toastr.error(this.translocoService.translate('toastr.cannot_select_same'));
                this.newPackinglistFilter.setValue('');
                this.to_packing_list_id = null;
                return;
            }

            this.newPackinglistFilter.setValue(`${selectedData.code}`);
        } else {
            if (this.newPackinglistFilter.invalid) {
                this.newPackinglistFilter.markAsTouched();
            }
            console.log('No packing list Found');
            return;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.checkScreenSize();
    }

    checkScreenSize() {
        this.isScreenSmall = window.innerWidth < 960;
    }
}
