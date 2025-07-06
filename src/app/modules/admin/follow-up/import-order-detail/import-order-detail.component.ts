import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
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
import { DialogOrderFeeComponent } from '../../dialog/dialog-order-fee/dialog.component';
import { DialogUpdateStatusComponent } from '../../dialog/dialog-update-status-order/dialog.component';
import { StatusChipComponent } from 'app/modules/common/status-chip/status-chip.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogUpdateDeliveryComponent } from '../../dialog/dialog-update-delivery/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FollowUpService } from '../follow-up.service';
import { FileNameFromUrlPipe } from 'app/file-name-from-url.pipe';
import { chain } from 'lodash';
import { UploadFileComponent } from 'app/modules/common/upload-file/upload-file.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-import-order-detail',
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
        StatusChipComponent,
        MatCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        FileNameFromUrlPipe,
        UploadFileComponent,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule
    ],
    templateUrl: './import-order-detail.component.html',
    styleUrl: './import-order-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DatePipe, DecimalPipe],
})
export class ImportOrderDetailComponent implements OnInit, AfterViewInit {
  formFieldHelpers: string[] = ['fuse-mat-dense'];
    id: any;
    data: any;
    selectAll: boolean = false;
    importProductOrderListFees: any[] = [];
    invoiceFiles: any[] = [];

    transportFiles: any[] = [];

    get totalFee() {
        if (!this.data) {
            return 0;
        }

        return this.data.import_product_order_list_fees.reduce((acc, cur) => acc + cur.amount, 0);
    }

    constructor(
        private _service: FollowUpService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _decimalPipe: DecimalPipe,
    ) {
        this.id = this._activateRoute.snapshot.params.id
    }

    ngOnInit(): void {
        this._service.get(this.id)
            .subscribe({
                next: (resp: any) => {
                    this.data = resp.data;

                    this.importProductOrderListFees = chain(this.data.import_product_order_list_fees)
                        .groupBy('fee_master.category_fee_master.name')
                        .map((value, key) => ({ name: key, value }))
                        .value();
                }
            })
    }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.dtTrigger.next(this.dtOptions);
        // }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        // this.dtTrigger.unsubscribe();
    }

    someSelect(): boolean {
        if (this.data?.order_lists == null) {
            return false;
        }
        return this.data.order_lists.filter(t => t.IsChecked).length > 0 && !this.selectAll;
    }

    clearSelection() {
        this.data.order_lists.forEach(item => {
            item.IsChecked = false;
        });

        this.selectAll = false;
    }

    SelectAll(checked: boolean) {
        this.selectAll = checked; // Set isSelectAll to true when selectAll is checked

        this.data.order_lists.forEach((item) => (item.IsChecked = this.selectAll));
    }

    updateAllselect() {
        this.selectAll = this.data.order_lists != null && this.data.order_lists.every(t => t.IsChecked);
    }

    get seleteListAll() {
        return this.data.order_lists != null && this.data.order_lists.filter(t => t.IsChecked).map(e => e.id);
    }

    backToDelivery() {
        this._router.navigate(['/delivery']);
    }

    goToEdit() {
        this._router.navigate(['/delivery-edit']);
    }

    // rerender(): void {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         // Destroy the table first
    //         dtInstance.destroy();
    //         // Call the dtTrigger to rerender again
    //         this.dtTrigger.next(this.dtOptions);
    //     });
    // }

    clickEditFee() {
        this.dialog.open(DialogOrderFeeComponent, {
            width: '500px',
            data: {

            }
        })
    }

    clickUpdateStatus() {
        this.dialog.open(DialogUpdateStatusComponent, {
            width: '500px',
            data: {
                orders: [this.data],
                status: [
                    { value: 'importing_documents', name: 'นำเข้าเอกสาร', },
                    { value: 'waiting_for_document_review', name: 'รอตรวจสอบเอกสาร', },
                    { value: 'waiting_for_tax_payment', name: 'รอชำระภาษี', },
                    { value: 'in_progress', name: 'อยู่ระหว่างดำเนินการ', },
                    { value: 'completed', name: 'เสร็จสิ้น', },
                ],
                service: 'import-product-order'
            }
        }).afterClosed().subscribe(() => {
            this.ngOnInit();
        })
    }

    clickUpdateTack(data: any) {
        this.dialog.open(DialogUpdateDeliveryComponent, {
            width: '500px',
            data: {
                order_list_id: data.id
            }
        }).afterClosed().subscribe(() => {
            this.ngOnInit();
        })
    }

    clickUpdateOrderListStatus(status: 'waiting_for_review' | 'reviewed' | 'reject') {
        this._service.updateStatusOrderListAll({
            order_lists: this.seleteListAll,
            status: status
        }).subscribe({
            next: (resp: any) => {
                this.selectAll = false;
                this.toastr.success('อัปเดตสถานะสำเร็จ');
                this.ngOnInit();
            },
            error: (error: any) => {
                this.toastr.error('ไม่สามารถอัปเดตสถานะได้');
            }
        });
    }

    async selectFileInvoice(event: any[]) {
        this.invoiceFiles = event;

        const data: any = await this.uploadImage(this.invoiceFiles[0]?.file)

        const body = {
            import_product_order_id: this.id,
            file: data?.data,
        }

        this._service.updateFileImportProductOrder(body).subscribe({
            next: (resp: any) => {
                this.toastr.success('อัปเดตสถานะสำเร็จ');
                this.ngOnInit();
            },
            error: (error: any) => {
                this.toastr.error('ไม่สามารถอัปเดตสถานะ');
            }
        })
        console.log(data);
    }

    uploadImage(file: File) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error("No file selected"));
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('path', 'images/asset/');

            this._service.upload(formData).subscribe({
                next: (resp: any) => resolve(resp),
                error: (err: any) => reject(err)
            });
        });
    }

    selectFile(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            let filePromises = Array.from(input.files).map((file, index) => {
                return new Promise<any>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            id: Date.now() + index, // สร้าง ID แบบสุ่ม
                            file,
                            product_image: reader.result as string,
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises).then(newFiles => {
                this.transportFiles = [...this.transportFiles, ...newFiles];
            });
        }
    }

    color(data: any): string {
        switch (data) {
            case 'pending': return 'bg-orange-500 ring-orange-200';
            case 'wait': return 'bg-blue-500 ring-blue-200';
            case 'close': return 'bg-green-500 ring-green-200';
            case 'error': return 'bg-red-500 ring-red-200';
            default: return 'bg-gray-400 ring-gray-200';
        }
    }

    label(data: any): string {
        switch (data) {
            case 'pending': return 'รอรับ Case';
            case 'wait': return 'กำลังตรวจสอบ';
            case 'close': return 'ปิด Case';
            case 'error': return 'เกิดข้อผิดพลาด';
            default: return 'ไม่ทราบสถานะ';
        }
    }
}
