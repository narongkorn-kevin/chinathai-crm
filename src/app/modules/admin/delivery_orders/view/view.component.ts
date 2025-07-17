import { debounceTime, ReplaySubject, Subject } from 'rxjs';
import {
    Component,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatTabsModule } from '@angular/material/tabs';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectMemberComponent } from 'app/modules/common/select-member/select-member.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment';
import { PictureMultiComponent } from 'app/modules/shared/picture-multi/picture-multi.component';
import { ADTSettings } from 'angular-datatables/src/models/settings';
@Component({
    selector: 'app-member-view',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.scss',
    providers: [CurrencyPipe],
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
    imageLoadError = false;
    filterForm: FormGroup;
    memberFilter = new FormControl('');
    filterMember: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    members: any[] = [];
    standard_size: any[] = [];  
    product_type: any[] = [];
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    
    protected _onDestroy = new Subject<void>();

    dtElement: DataTableDirective;

    constructor(
        private FormBuilder: FormBuilder,
        public _service: DeliveryOrdersService,
        private fuseConfirmationService: FuseConfirmationService,
        private userService: DeliveryOrdersService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private translocoService: TranslocoService,
        private _matDialog: MatDialog
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data.data;
        this.product_type = this.activated.snapshot.data?.product_type?.data;
        this.standard_size = this.activated.snapshot.data?.standard_size?.data;

        console.log(this.data, 'data');

        this.filterForm = this.FormBuilder.group({
            type: [''],
            name: [''],
            product_type: [''],
            member_id: [''],
            logo: [''],
        });

        this.lang = translocoService.getActiveLang();
        this.langues = localStorage.getItem('lang');
    }
    langues: any;
    lang: String;
    languageUrl: any;

    filteredDeliveryOrderLists: any[] = [];
    barcodeLists: any[] = [];

    ngOnInit(): void {
        this.form = this.FormBuilder.group({});

        this.form.patchValue({});
        if (
            this.data &&
            this.data.delivery_order_tracks &&
            this.data.delivery_order_tracks.length > 0
        ) {
            this.selectedTrack = this.data.delivery_order_tracks[0];
        }
        this.filteredDeliveryOrderLists = this.selectedTrack.delivery_order_lists.map((item: any) => {
            const width = Number(item.width || 0);
            const height = Number(item.height || 0);
            const long = Number(item.long || 0);
            const qty_box = Number(item.qty_box || 0);

            const cbmPerPiece = (width * height * long) / 1_000_000;
            const cbmTotal = cbmPerPiece * qty_box;

            return {
                ...item,
                cbm: +cbmPerPiece.toFixed(4), // CBM ต่อกล่อง
                cbm_total: +cbmTotal.toFixed(4), // CBM รวมของรายการนี้
            };
        });
        
        this.filterForm.get('name')!.valueChanges
            .pipe(debounceTime(300))
            .subscribe(() => {
                this.Filter();
        });

        // รวม CBM ทั้งหมด
        const totalCbm = this.filteredDeliveryOrderLists.reduce((sum: number, item: any) => sum + (item.cbm_total || 0), 0);


        // Patch ค่า CBM รวมกลับเข้า selectedTrack หรือที่อื่นที่ต้องการ
        this.selectedTrack.total_cbm = +totalCbm.toFixed(4);

        this.barcodeLists =
            this.selectedTrack.barcode_lists;


    }

    Close() {
        this._router.navigate(['member']);
    }

    get totallist() {
        return this.filteredDeliveryOrderLists.length;
    }
    get totalBoxes() {
        return this.filteredDeliveryOrderLists.reduce(
            (sum, item) => sum + item.qty_box,
            0
        );
    }

    get totalUnits() {
        return this.filteredDeliveryOrderLists.reduce(
            (sum, item) => sum + (Number(item.qty || 0) * Number(item.qty_box || 1)),
            0
        );
    }

    get totalWeight(): string {
        return this.filteredDeliveryOrderLists
            .reduce((sum, product) => {
                const qty = Number(product.qty_box || 0);
                const Weight = Number(product.weight || 0);
                return sum + qty * Weight;
            }, 0)
            .toFixed(4);
    }
    get totalCBM(): string {
        if (!Array.isArray(this.filteredDeliveryOrderLists)) {
            return '0.000000';
        }

        const total = this.filteredDeliveryOrderLists.reduce((sum, item) => {
            console.log(item.qty_box);
            
            const cbmPerUnit = parseFloat(item.cbm) || 0;
            const qty = parseInt(item.qty_box) || 0;
            const totalCbm = cbmPerUnit * qty;
            return sum + totalCbm;
        }, 0);

        return total.toFixed(4);
    }



    selectedTrack: any;
    selectTrack(track: any): void {
        console.log('track', track);
        this.selectedTrack = track;
        this._changeDetectorRef.detectChanges();
        this.filteredDeliveryOrderLists =
            this.selectedTrack.delivery_order_lists;
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
        this.filteredDeliveryOrderLists = [...this.selectedTrack.delivery_order_lists];
        this.rerender(); // สำหรับ DataTables
    }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }
    Filter(): void {
        console.log('filterForm', this.filterForm.value);
        console.log('selectedTrack.delivery_order_lists', this.selectedTrack.delivery_order_lists);

        const filterValues = this.filterForm.value;

        this.filteredDeliveryOrderLists = this.selectedTrack.delivery_order_lists.filter((item) => {
            return (
                (!filterValues.type || item.product_type_id == filterValues.type) &&

                (!filterValues.name ||
                    item.product_name?.toLowerCase().includes(filterValues.name.toLowerCase())) &&

                (!filterValues.product_type ||
                    item.standard_size_id == filterValues.product_type) &&

                (!filterValues.member_id ||
                    item.member_id == filterValues.member_id) &&

                (!filterValues.logo ||
                    item.logo?.toLowerCase().includes(filterValues.logo.toLowerCase()))
            );
        });

            if (!filterValues.name && !filterValues.type && !filterValues.product_type) {
                this.filteredDeliveryOrderLists = [...this.selectedTrack.delivery_order_lists];
                }

                this.rerender();  // สำหรับ DataTables (ถ้าใช้)
    }

    selectMember(item: any) {
        this.filterForm.patchValue({
            member_id: item?.id,
        });
    }

    goToEdit() {
        this._router.navigate(['/delivery_orders/edit/' + this.data.id]);
    }
    goToPrint() {
        window.open(environment.apiUrl + '/api/get_trackings_pdf/' + this.Id)
    }
    getProductTypeName(productTypeId: number): string {
        if (!productTypeId || !this.product_type || this.product_type.length === 0) {
            return '-';
        }

        const foundType = this.product_type.find(type => type.id === productTypeId);
        return foundType ? foundType.name : '-';
    }

    showPicture(images: any[]): void {
        const imgList = images.map(item => item.image_url);
        this._matDialog.open(PictureMultiComponent, {
            data: {
                images: imgList,
                selectedIndex: 0
            },
            width: '90vw',
            height: '90vh',
        });
    }
}
