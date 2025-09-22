import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject, map } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { CouponService } from './coupon.service';
import { CouponComposeComponent } from './dialog/coupon-compose/coupon-compose.component';

@Component({
  selector: 'app-coupon',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    MatButtonModule,
    MatIconModule,
    FilePickerModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DatePipe]
})
export class CouponComponent implements OnInit, AfterViewInit {
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  @ViewChild('btNg') btNg: any;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  @ViewChild('dateCell') dateCell: any;

  constructor(
    private _service: CouponService,
    private fuseConfirmationService: FuseConfirmationService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.loadTable());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dtTrigger.next(this.dtOptions);
    }, 200);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadTable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this._service
          .datatable(dataTablesParameters)
          .pipe(map((resp: { data: any }) => resp.data))
          .subscribe({
            next: (resp: any) => {
              callback({
                recordsTotal: resp.total,
                recordsFiltered: resp.total,
                data: resp.data,
              });
            },
          });
      },
      columns: [
        { title: 'ลำดับ', data: 'No', className: 'w-15 text-center' },
        { title: 'รหัส', data: 'code', className: 'text-center' },
        { title: 'ชื่อคูปอง', data: 'name', className: 'text-center' },
        { title: 'รายละเอียด', data: 'description', className: 'text-center' },
        { title: 'มูลค่า', data: 'amount', className: 'text-center' },
        { title: 'จำนวน', data: 'qty', className: 'text-center' },
        {
          title: 'วันหมดอายุ',
          data: 'expire_date',
          ngPipeInstance: this.datePipe,
          ngPipeArgs: ['dd-MM-yyyy'],
          className: 'text-center',
        },
        { title: 'หน่วยมูลค่า', data: 'type_amount', className: 'text-center' },
        { title: 'ประเภท', data: 'type', className: 'text-center' },
        {
          title: 'จัดการ',
          data: null,
          defaultContent: '',
          ngTemplateRef: { ref: this.btNg },
          className: 'w-15 text-center',
        },
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(this.dtOptions);
    });
  }

  createCoupon() {
    const DialogRef = this.dialog.open(CouponComposeComponent, {
      disableClose: true,
      // Responsive: fit within viewport and allow internal scroll
      width: '95vw',
      maxWidth: '680px',
      height: 'auto',
      maxHeight: '90vh',
      data: { type: 'NEW' },
    });
    DialogRef.afterClosed().subscribe((result) => {
      if (result) this.rerender();
    });
  }

  openDialogEdit(id: any) {
    this._service.get(id).subscribe((resp: any) => {
      const DialogRef = this.dialog.open(CouponComposeComponent, {
        disableClose: true,
        width: '95vw',
        maxWidth: '680px',
        height: 'auto',
        maxHeight: '90vh',
        data: { type: 'EDIT', value: resp },
      });
      DialogRef.afterClosed().subscribe((result) => {
        if (result) this.rerender();
      });
    });
  }

  clickDelete(id: any) {
    const confirmation = this.fuseConfirmationService.open({
      title: 'ยืนยันลบข้อมูล',
      message: 'กรุณาตรวจสอบข้อมูล หากลบข้อมูลแล้วจะไม่สามารถนำกลับมาได้',
      icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warn' },
      actions: {
        confirm: { show: true, label: 'ยืนยัน', color: 'primary' },
        cancel: { show: true, label: 'ยกเลิก' },
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this._service.delete(id).subscribe({
          complete: () => {
            this.toastr.success('ดำเนินการลบสำเร็จ');
            this.rerender();
          },
        });
      }
    });
  }
}
