import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DataTablesModule } from 'angular-datatables';

import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportService } from '../page.service';
import { MatSelectModule } from '@angular/material/select';
import { createFileFromBlob } from 'app/helper';
@Component({
    selector: 'app-report-payment-type',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        DataTablesModule,
        MatSelectModule
    ],

    templateUrl: './report.component.html',
    styleUrl: './report.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPaymentTypeComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    orders: any[] = [];
    form: FormGroup;
    exportForm: FormGroup
    paymentType: any[] = [
        {id: 1 , name: 'เงินสด' },
        {id: 2 , name: 'QR Promptpay ' },
        {id: 3 , name: 'แม่มณี' },
        {id: 4 , name: 'Credit Card/Debit Card' },
        {id: 4 , name: 'We Chat' },
        {id: 4 , name: 'Alipay' },

    ]
    constructor(
        private _service : ReportService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fb: FormBuilder,
    ) {
        this.form = this._fb.group({
            payment_type: '',

        })
        this.exportForm = this._fb.group({
            startDate: '',
            endDate: '',
        })
    }

    exportExcel() {
        this._service.exportExcelPaymentType('').subscribe({
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
                            "orderNo5": "กาแฟ",
                            "orderNo4": 20,
                            "orderNo": 10,
                            "orderNo2": 10,
                            "orderDate": "2024-03-12T09:21:10.716Z",
                            "grandTotal": 300
                        },
                        {
                            "id": 2,
                            "createdAt": "2024-03-17T09:24:55.488Z",
                            "updatedAt": "2024-03-17T09:24:55.488Z",
                            "deletedAt": null,
                            "orderNo5": "ชา",
                            "orderNo4": 20,
                            "orderNo": 10,
                            "orderNo2": 10,
                            "orderDate": "2024-03-17T09:24:55.502Z",
                            "grandTotal": 280
                        },
                        {
                            "id": 3,
                            "createdAt": "2024-03-17T13:40:49.535Z",
                            "updatedAt": "2024-03-17T13:40:49.535Z",
                            "deletedAt": null,
                            "orderNo5": "ขนมหวาน",
                            "orderNo4": 20,
                            "orderNo": 10,
                            "orderNo2": 10,
                            "orderDate": "2024-03-17T13:40:49.547Z",
                            "grandTotal": 110
                        },
                        {
                          "id": 4,
                          "createdAt": "2024-03-17T13:40:49.535Z",
                          "updatedAt": "2024-03-17T13:40:49.535Z",
                          "deletedAt": null,
                          "orderNo5": "ของทานเล่น",
                          "orderNo4": 20,
                          "orderNo": 10,
                          "orderNo2": 10,
                          "orderDate": "2024-03-17T13:40:49.547Z",
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
              title: 'ประเภทการสินค้า',
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
              title: 'จำนวนบิลทั้งหมด',
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
              data: 'orderNo',
              render: function (data, type, row) {
                if (type === 'display' || type === 'filter') {

                }
                  return data;
              },
              className: 'text-center'
          },
             {
                title: 'บิลพร้อมเพย์',
                data: 'orderNo2',
                render: function (data, type, row) {
                  if (type === 'display' || type === 'filter') {
                      // ใช้ toLocaleString() เพื่อแสดงเป็นเครื่องหมายเงิน (Currency) พร้อมกับเครื่องหมาย ','

                  }
                    return data;
                },
                className: 'text-center'
            },
            {
                title: 'ยอดรวมสุทธิ',
                data: 'grandTotal',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        // ใช้ toLocaleString() เพื่อแสดงเป็นเครื่องหมายเงิน (Currency) พร้อมกับเครื่องหมาย ','
                        return Number(data).toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 });
                    }
                    return data;
                },
                className: 'text-center'
            },
            {
                title: "อัปเดตล่าสุด",
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
            }
        ]
        };
    }
}
