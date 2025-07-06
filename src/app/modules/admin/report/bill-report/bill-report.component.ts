import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DataTablesModule } from 'angular-datatables';
import { DataTableDirective} from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportService } from '../page.service';
import { MatSelectModule } from '@angular/material/select';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { createFileFromBlob } from 'app/helper';
@Component({
  selector: 'app-bill-report',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    MatSelectModule],
  templateUrl: './bill-report.component.html',
  styleUrl: './bill-report.component.scss'
})
export class BillReportComponent {
  dtOptions: DataTables.Settings = {};
  orders: any[] = [];
  dtElement: DataTableDirective;
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  form: FormGroup;
  addForm: FormGroup;
  exportForm: FormGroup
    stores: any[]=[];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
  paymentType: any[] = [
      {id: 1 , name: 'เงินสด' },
      {id: 2 , name: 'QR Promptpay ' },
      {id: 3 , name: 'แม่มณี' },
      {id: 4 , name: 'Credit Card/Debit Card' },
      {id: 4 , name: 'We Chat' },
      {id: 4 , name: 'Alipay' },

  ]
  range = new FormGroup({
    start: new FormControl <Date | null>(null),
    end: new FormControl <Date | null>(null),
  });

  constructor(
      private _service : ReportService,
      public dialog: MatDialog,
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _fb: FormBuilder,
  ) {

        this.form = this._fb.group({
            startDate: '',
            endDate: '',
        })
        this.exportForm = this._fb.group({
            startDate: '',
            endDate: '',
        })
        this.form = this._fb.group({
            payment_type: '',

        })
  }

  exportExcel() {
    this._service.exportExcelBill('').subscribe({
        next: (resp) => {
          createFileFromBlob(resp)
        },
        error: (err) => {
            console.error(err)
            alert(JSON.stringify(err.statusText))
        }
        })
    }

  ngOnInit(): void {
      this.form.patchValue({
          payment_type: ''
      })
      this._service.getOrder().subscribe((resp: any)=>{
              this.orders = resp;


      })

      this.dtOptions = {
        pagingType: 'full_numbers',
        serverSide: true,     // Set the flag
        ajax: (dataTablesParameters: any, callback) => {
            callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: [
                    {
                        "id": 1,
                        "createdAt": "2024-03-12T09:21:10.700Z",
                        "updatedAt": "2024-03-12T09:21:10.700Z",
                        "deletedAt": null,
                        "orderNo": 210,
                        "orderNo4": 90,
                        "orderNo5": 90,
                        "orderNo8": 100,
                        "orderDate": "2024-03-12T09:21:10.716Z",
                        "grandTotal": 300
                    },
                    {
                        "id": 2,
                        "createdAt": "2024-03-13T09:24:55.488Z",
                        "updatedAt": "2024-03-13T09:24:55.488Z",
                        "deletedAt": null,
                        "orderNo": 200,
                        "orderNo4": 90,
                        "orderNo5": 90,
                        "orderNo8": 100,
                        "orderDate": "2024-03-13T09:24:55.502Z",
                        "grandTotal": 280
                    },
                    {
                        "id": 3,
                        "createdAt": "2024-03-14T13:40:49.535Z",
                        "updatedAt": "2024-03-14T13:40:49.535Z",
                        "deletedAt": null,
                        "orderNo": 80,
                        "orderNo4": 90,
                        "orderNo5": 90,
                        "orderNo8": 100,
                        "orderDate": "2024-03-14T13:40:49.547Z",
                        "grandTotal": 110
                    },
                    {
                      "id": 4,
                      "createdAt": "2024-03-14T13:40:49.535Z",
                      "updatedAt": "2024-03-14T13:40:49.535Z",
                      "deletedAt": null,
                      "orderNo": 80,
                      "orderNo4": 90,
                      "orderNo5": 90,
                      "orderNo8": 100,
                      "orderDate": "2024-03-15T13:40:49.547Z",
                      "grandTotal": 110
                  },
                  {
                    "id": 5,
                    "createdAt": "2024-03-14T13:40:49.535Z",
                    "updatedAt": "2024-03-14T13:40:49.535Z",
                    "deletedAt": null,
                    "orderNo": 80,
                    "orderNo4": 90,
                    "orderNo5": 90,
                    "orderNo8": 100,
                    "orderDate": "2024-03-16T13:40:49.547Z",
                    "grandTotal": 110
                },

                ]
            });
        },
          columns: [
              {
                title: 'ID',
                data: 'id',
                className: 'text-center'
              },

              {
                title: "วันที่",
                data: "orderDate",
                render: function (data, type, row) {
                    // ตรวจสอบว่าประเภทข้อมูลเป็นแบบแสดงหรือไม่
                    if (type === 'display' || type === 'filter') {
                        // สร้างวัตถุ Date จากข้อมูลวันที่
                        var date = new Date(data);
                        // จัดรูปแบบวันที่ใหม่ (ในที่นี้จะใช้รูปแบบ 'dd/mm/yyyy')
                        var formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()+ ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                        return formattedDate;
                    }
                    // สำหรับประเภทข้อมูลอื่นๆ ให้คืนค่าข้อมูลเดิม
                    return data;
                },
                className: 'text-center'
              },
              {
                title: 'จำนวนบิลต่อวัน',
                data: 'orderNo',
                render: function (data, type, row) {
                  if (type === 'display' || type === 'filter') {
                      // ใช้ toLocaleString() เพื่อแสดงเป็นเครื่องหมายเงิน (Currency) พร้อมกับเครื่องหมาย ','

                  }
                    return data;
                },
                className: 'text-center'
              },
              {
                title: 'บิลพร้อมเพย์',
                data: 'orderNo4',
                render: function (data, type, row) {
                  if (type === 'display' || type === 'filter') {
                      // ใช้ toLocaleString() เพื่อแสดงเป็นเครื่องหมายเงิน (Currency) พร้อมกับเครื่องหมาย ','

                  }
                    return data;
                },
                className: 'text-center'
              },
              {
                title: 'บิลเงินสด',
                data: 'orderNo5',
                render: function (data, type, row) {
                  if (type === 'display' || type === 'filter') {
                      // ใช้ toLocaleString() เพื่อแสดงเป็นเครื่องหมายเงิน (Currency) พร้อมกับเครื่องหมาย ','

                  }
                    return data;
                },
                className: 'text-center'
              },
              {
                title: 'ยอดรายได้รายวัน',
                data: 'orderNo8',
                render: function (data, type, row) {
                  if (type === 'display' || type === 'filter') {
                      // ใช้ toLocaleString() เพื่อแสดงเป็นเครื่องหมายเงิน (Currency) พร้อมกับเครื่องหมาย ','
                      return Number(data).toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 });
                  }
                    return data;
                },
                className: 'text-center'
              }
          ]
        };
      }



  onSearch() {
    this.rerender()
}


rerender(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.dtOptions);
  });
}





}
