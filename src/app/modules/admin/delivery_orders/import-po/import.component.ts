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
    templateUrl: './import.component.html',
    styleUrl: './import.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class ImportComponent implements OnInit, AfterViewInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    // mock dropdown lists
    whList = ['WH-A', 'WH-B', 'WH-C'];
    productList = ['A', 'B', 'C'];
    categoryFee: any[] = [];
    store$: Observable<any>;
    po$: Observable<any>;
    form: FormGroup;
    search: FormControl = new FormControl('', []);
    isShow : boolean = false 
    protected _onDestroy = new Subject<void>();

    selectAll: boolean = false;

    purchaseOrder: any[] = [];

    invoiceFiles: any[] = [];
    packingListFiles: any[] = [];
    otherFiles: any[] = [];
 
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
            tracking: '',
            start_date: '',
            end_date: '',
            items: this._fb.array([]),
        });

        // mock ข้อมูล 3 แถว
        for (let i = 0; i < 3; i++) {
            this.addRow();
        }


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

      get items(): FormArray {
            return this.form.get('items') as FormArray;
        }
    
        addRow() {
            const group = this._fb.group({
                pallet: [''],
                wm: ['WH'],
                lot: [''],
                status: [''],
                carton: [''],
                receiveDate: [''],
                shipoutDate: [''],
                productCode: [''],
                orderNo: [''],
                customerPo: [''],
                barcode: [''],
                tracking: [''],
                qty: [''],
                weight: [''],
                length: [''],
                width: [''],
                height: [''],
                description: [''],
                brand: [''],
                category: [''],
                color: [''],
                price: [''],
                cbm: [''],
                expiry: [''],
                customer: [''],
                remark: [''],
                trackingNo: 'PH003',
                cartonNo: 'carton No',
                lotNo: '1090',
                transportMethod: 'ทางรถ',
                trackingExt: '',
                chinaFreightCost: '',
                productName: '',
                impPre: '',
                profileRemark: '',
                customRemark: '',
                shipOutDate: '',
                lastUpdate: '',
                productDetail: '',
                warehouse: 'WH',
                receiveStatus: 'เข้าโกดังจีน',
                woodenBoxCost: '',
                palletCost: '',
                otherCost: '',
                customerName: '',
                customerReferenceCode: '',
                customerCodeSystem: '',
                customerCodeOnBox: '',
    
            });
    
            this.items.push(group);
        }

}
