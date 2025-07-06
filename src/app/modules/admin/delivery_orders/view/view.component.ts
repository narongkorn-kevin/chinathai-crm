import { ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { Component, OnInit, OnChanges, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { DeliveryOrdersService } from '../delivery-orders.service';
import { createFileFromBlob } from 'app/modules/shared/helper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
@Component({
    selector: 'app-member-view',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    providers: [CurrencyPipe],
    imports: [
        CommonModule,
        DataTablesModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatCheckbox,
        MatDivider,
        RouterLink,
        CdkMenuModule,
        MatTabsModule,
        MatAutocompleteModule,
        SelectMemberComponent,
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
    form: FormGroup;
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    filterForm: FormGroup;
    memberFilter = new FormControl('');
    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    members:any[] = [];
    standard_size:any[] = [];
    product_type:any[] = [];

    protected _onDestroy = new Subject<void>();


    constructor(
        private FormBuilder: FormBuilder,
        public _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: DeliveryOrdersService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data.data;
        this.product_type = this.activated.snapshot.data?.product_type?.data
        this.standard_size = this.activated.snapshot.data?.standard_size?.data

        this.filterForm = this.FormBuilder.group({
            type: [''],
            name: [''],
            product_type: [''],
            member_id: [''],
            logo: [''],
        });
    }

    filteredDeliveryOrderLists: any[] = [];

    ngOnInit(): void {
        this.form = this.FormBuilder.group({});

        this.form.patchValue({});
        if (this.data && this.data.delivery_order_tracks && this.data.delivery_order_tracks.length > 0) {
            this.selectedTrack = this.data.delivery_order_tracks[0];
        }
        this.filteredDeliveryOrderLists = this.selectedTrack.delivery_order_lists;
    }

    Close() {
        this._router.navigate(['member']);
    }

    get totallist() {
        return this.filteredDeliveryOrderLists.length;
    }
    get totalBoxes() {
        return this.filteredDeliveryOrderLists.reduce((sum, item) => sum + item.qty_box, 0);
    }

    get totalUnits() {
        return this.filteredDeliveryOrderLists.reduce((sum, item) => sum + item.qty, 0);
    }

    get totalWeight() {
        return this.filteredDeliveryOrderLists.reduce((sum, item) => sum + parseFloat(item.weight), 0);
    }

    get totalCBM() {
        if (!this.filteredDeliveryOrderLists) {
            return null;
        }
        return this.filteredDeliveryOrderLists.reduce((sum, item) => sum + parseFloat(item.cbm), 0);
    }

    selectedTrack: any;
    selectTrack(track: any): void {
        console.log('track',track);
        this.selectedTrack = track;
        this._changeDetectorRef.detectChanges();
        this.filteredDeliveryOrderLists = this.selectedTrack.delivery_order_lists;
    }
    showFilterForm: boolean = false;

    openfillter() {
        this.showFilterForm = !this.showFilterForm;
    }

    applyFilter() {
        const filterValues = this.filterForm.value;
        console.log(filterValues);
    }
    clearFilter() {
        this.filterForm.reset();
    }
    Filter(): void {
        console.log('filterForm',this.filterForm.value);
        console.log('selectedTrack.delivery_order_lists',this.selectedTrack.delivery_order_lists);

        const filterValues = this.filterForm.value;
        this.filteredDeliveryOrderLists = this.selectedTrack.delivery_order_lists.filter(item => {
            return (!filterValues.type || item.product_type_id === filterValues.type) &&
                   (!filterValues.name || item.product_name.includes(filterValues.name)) &&
                   (!filterValues.product_type || item.standard_size_id === filterValues.product_type) &&
                   (!filterValues.member_id || item.member_id === filterValues.member_id) &&
                   (!filterValues.logo || item.logo.includes(filterValues.logo));
        });
    }

    selectMember(item: any) {
        this.filterForm.patchValue({
            member_id: item?.id
        })
    }

    goToEdit(){
        this._router.navigate(['/delivery_orders/edit/' + this.data.id]);
    }
    goToPrint(){
        console.log('print');
    }
}
