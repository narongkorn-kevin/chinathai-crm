import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
// import { PoService } from './po.service';
import { filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateTime } from 'luxon';
import { DialogAddressComponent } from '../../member/dialog-address/dialog-address.component';
import { DialogAddress } from '../../member/dialog-address/dialog-address';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectImporterComponent } from 'app/modules/common/select-importer/select-importer.component';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { items } from 'app/mock-api/apps/file-manager/data';
import { DeliveryOrdersService } from '../delivery-orders.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-edit-multi-po',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        MatTableModule,
        CdkMenuModule,
        MatCheckboxModule,
        FormsModule,
        MatLabel,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatBadgeModule,
        RouterLink,
        SelectImporterComponent,
        SelectMemberComponent,
        UploadFileComponent,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class EditMultiPoComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    // mock dropdown lists
    whList = ['WH-A', 'WH-B', 'WH-C'];
    productList = ['A', 'B', 'C'];
    categoryFee: any[] = [];
    store$: Observable<any>;
    po$: Observable<any>;
    form: FormGroup;
    search: FormControl = new FormControl('', []);

    protected _onDestroy = new Subject<void>();

    selectAll: boolean = false;

    purchaseOrder: any[] = [];

    invoiceFiles: any[] = [];
    packingListFiles: any[] = [];
    otherFiles: any[] = [];
    items = [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' },
        { name: 'Grapes' },
    ];
    constructor(
        private _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _decimalPipe: DecimalPipe,
        private _fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.form = this._fb.group({
            // ข้อมูลการจัดส่ง
            wh: [null, Validators.required],
            lot_no: [''],
            carton_no: ['Cartoon no'],
            shipping_method: ['ทางรถ'],
            receive_date: [null],
            ship_out_date: [null],

            // ข้อมูลคำสั่งซื้อ
            imp_pre: ['PRE'],

            // ข้อมูลลูกค้า
            customer_code: [''],

            // ข้อมูลสินค้า
            product: ['C'],
            weight: [20],
            qty: [0],
            width: [100],
            length: [100],
            height: [100],
            description: [''],

            // ข้อมูลเพิ่มเติม
            remark: ['']
        });


    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
    }

    async submit() {

    }

    someSelect(): boolean {
        if (this.purchaseOrder == null) {
            return false;
        }
        return this.purchaseOrder.filter(t => t.IsChecked).length > 0 && !this.selectAll;
    }

    clearSelection() {
        this.purchaseOrder.forEach(item => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.purchaseOrder.forEach((item) => (item.IsChecked = this.selectAll));
    }

    updateAllselect() {
        this.selectAll = this.purchaseOrder != null && this.purchaseOrder.every(t => t.IsChecked);
    }

    get seletedList() {
        return this.purchaseOrder != null && this.purchaseOrder.filter(t => t.IsChecked).map(e => e.id);
    }

    selectMember(event: any) {
        console.log(event);
    }

    selectFileInvoice(event: any) {
        this.invoiceFiles = event
    }

    selectFilePackingList(event: any) {
        this.packingListFiles = event
    }

    selectFileOther(event: any) {
        this.otherFiles = event
    }

}
