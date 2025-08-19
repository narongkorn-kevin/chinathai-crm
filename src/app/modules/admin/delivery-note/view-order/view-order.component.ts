// Re-compiling the component to resolve template errors
import { DeliveryService } from '../../stock/delivery/delivery.service';
import { CdkMenuModule } from '@angular/cdk/menu';
import { Subscription, forkJoin } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit, OnChanges, Inject } from '@angular/core';
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
import { PictureComponent } from 'app/modules/shared/picture/picture.component';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DeliveryNoteService } from '../delivery-note.service';

@Component({
    selector: 'app-delivery-note-view-order',
    standalone: true,
    templateUrl: './view-order.component.html',
    styleUrl: './view-order.component.scss',
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
        MatDividerModule,
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
export class ViewOrderComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    dtOptions: DataTables.Settings = {};
    type: string;
    Id: number;
    data: any;
    lists = [];
    allDeliveryOrders: any[] = [];
    filteredDeliveryOrders: any[] = [];
    filteredOut: any[] = [];
    filteredtracking: any[] = [];
    Form: FormGroup;
    customers: any = [];
    truckImages: any[] = [];
    productImages: any[] = [];
    deliveryNoteImage: any;
    imageLoadedMap: { [key: string]: boolean } = {};
   

    status_type: string;

    constructor(
        private translocoService: TranslocoService,
        private FormBuilder: FormBuilder,
        public _service: DeliveryService,
        private _deliveryNoteService: DeliveryNoteService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        private _router: Router,
        private activated: ActivatedRoute,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.type = this.activated.snapshot.data.type;
        this.Id = this.activated.snapshot.params.id;
        this.data = this.activated.snapshot.data.data?.data;
        if (this.data?.transport_type === 'รถบริษัท') {
            this.status_type = 'send';
        } else {
            this.status_type = 'pick';
        }
    }
    ngOnInit(): void {
        if (this.type === 'edit' && this.data?.member) {
            this.customers = [this.data.member];
        } else {
            this._deliveryNoteService.getCustomers().subscribe((resp: any) => {
                this.customers = resp.data;
            });
        }
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
        
        if (this.data) {
            if (this.data.delivery_in_thai_images && this.data.delivery_in_thai_images.length > 0) {
                this.truckImages = this.data.delivery_in_thai_images.filter(img => img.type === 'truck');
                this.productImages = this.data.delivery_in_thai_images.filter(img => img.type === 'product');
                this._changeDetectorRef.markForCheck();
            }

            if (this.data.image_url) {
                this.deliveryNoteImage = { image_url: this.data.image_url };
                this._changeDetectorRef.markForCheck();
            }

            const observables = this.data.delivery_in_thai_control_lists.map(item =>
                this._deliveryNoteService.getDeliveryInThaiById(item.delivery_in_thai_id)
            );

            forkJoin(observables).subscribe((responses: any[]) => {
                this.allDeliveryOrders = responses.map(resp => resp.data);
                this.filteredDeliveryOrders = [...this.allDeliveryOrders];
                this.filteredOut = [...this.allDeliveryOrders];
                this._changeDetectorRef.markForCheck();
            });

            this.Form.patchValue({
                customerCode: this.data.member_id,
                warehouseDate: this.data.date_in,
                note: this.data.remark,
                shippedBy: this.data.transport_type,
                fullName: this.data.member_address?.contact_name,
                driverPhone: this.data.member_address?.contact_phone,
            });
        }

        if (this.type !== 'edit') {
            this.Form.get('customerCode').valueChanges.subscribe(val => {
                const selectedCustomer = this.customers.find(c => c.id === val);
                if (selectedCustomer) {
                    console.log(selectedCustomer)
                    this.Form.patchValue({
                        fullName: selectedCustomer.fname,
                        driverPhone: selectedCustomer.phone
                    });
                    if (selectedCustomer.delivery_in_thais) {
                        this.filteredDeliveryOrders = selectedCustomer.delivery_in_thais;
                    }
                } else {
                    this.filteredDeliveryOrders = [];
                }
            });
        }

        this.filterForm.get('in_store').valueChanges.pipe(debounceTime(500)).subscribe(value => {
            if (value) {
                this.filteredDeliveryOrders = this.allDeliveryOrders.filter(order =>
                    order.code.toLowerCase().includes(value.toLowerCase())
                );
            } else {
                this.filteredDeliveryOrders = [...this.allDeliveryOrders];
            }
        });
    }

    onImageError(url: string) {
        this.imageLoadedMap[url] = false;
    }
    
    onImageLoad(url: string) {
        this.imageLoadedMap[url] = true;
    }
    
    isImageLoaded(url: string): boolean {
        return this.imageLoadedMap[url] !== false;
    }

    showPicture(imgObject: string): void {
         
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
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
        this.filterForm.reset();
        this.filteredDeliveryOrders = [...this.allDeliveryOrders];
    }

    applyFilter() {
        const { code, member_id, sack_code } = this.filterForm.value;
        this.filteredDeliveryOrders = this.allDeliveryOrders.filter(
            (order) => {
                return (
                    (!code || order.code.includes(code)) &&
                    (!member_id || order.member_id.toString().includes(member_id)) &&
                    (!sack_code || (order.sack_code && order.sack_code.includes(sack_code)))
                );
            }
        );
    }

    clearFilter() {
        this.filterForm.reset();
        this.filteredDeliveryOrders = [...this.allDeliveryOrders];
    }

    close() {
        this._router.navigate(['/delivery-note']);
    }

    print() {
        window.open(`https://cargo-api.dev-asha9.com/api/get_delivery_doc_by_bill/${this.Id}`);
    }
    Submit() {
        if (this.Form.invalid) {
            this.toastr.error(
                this.translocoService.translate('toastr.missing_fields')
            );
            this.Form.markAllAsTouched();
            return;
        }

        if (this.type === 'edit') {
            const payload = {
                billing_id: this.Id,
                member_id: this.Form.value.customerCode,
                member_address_id: this.data.member_address_id,
                date_in: this.Form.value.warehouseDate,
                date_out: this.data.date_out,
                remark: this.Form.value.note,
                transport_type: this.Form.value.shippedBy,
                image: this.deliveryNoteImage?.image,
                image_url: this.deliveryNoteImage?.image_url,
                delivery_in_thai_images: [...this.truckImages, ...this.productImages]
            };

            this._deliveryNoteService.updateBills(this.Id, payload).subscribe({
                next: (resp) => {
                    this.toastr.success('บันทึกสำเร็จ');
                    this._router.navigate(['/delivery-note']);
                },
                error: (err) => {
                    this.toastr.error('เกิดข้อผิดพลาด');
                }
            });
        } else {
            const selectedCustomer = this.customers.find(c => c.id === this.Form.value.customerCode);
            const lists = this.filteredDeliveryOrders.map(order => ({ delivery_in_thai_id: order.id }));

            const payload = {
                member_id: selectedCustomer.id,
                member_address_id: selectedCustomer.delivery_in_thais[0].member_address_id,
                date_in: this.Form.value.warehouseDate,
                date_out: null,
                remark: this.Form.value.note,
                transport_type: this.Form.value.shippedBy,
                image_url: this.deliveryNoteImage?.image_url,
                image: this.deliveryNoteImage?.image,
                images: [...this.truckImages, ...this.productImages],
                lists: lists
            };

            this._deliveryNoteService.createBills(payload).subscribe({
                next: (resp) => {
                    this.toastr.success('บันทึกสำเร็จ');
                    this._router.navigate(['/delivery-note']);
                },
                error: (err) => {
                    this.toastr.error('เกิดข้อผิดพลาด');
                }
            });
        }
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
                type: "BILL_CONTROLL_ACTION"
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            console.log(result)
            if (result) {
                if (title === 'รูปรถ') {
                    const newImages = result.map(imgData => ({
                        image: imgData.image,
                        image_url: imgData.image_url,
                        type: 'truck',
                        delivery_in_thai_c_id: this.Id
                    }));
                    this.truckImages.push(...newImages);
                } else if (title === 'รูปสินค้า') {
                    const newImages = result.map(imgData => ({
                        image: imgData.image,
                        image_url: imgData.image_url,
                        type: 'product',
                        delivery_in_thai_c_id: this.Id
                    }));
                    this.productImages.push(...newImages);
                } else if (title === 'รูปใบส่งของ') {
                    const imgData = result[0];
                    if (imgData) {
                        this.deliveryNoteImage = {
                            image: imgData.image,
                            image_url: imgData.image_url
                        };
                    }
                }
            }
        });
    }
}
