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

    templateUrl: './cashier.component.html',
    styleUrl: './cashier.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashierComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    orders: any[] = [];
    form: FormGroup;
    exportForm: FormGroup
    cashiers: any[] = [
        //{id: 1 , name: 'เงินสด' },
        //{id: 2 , name: 'QR Promptpay ' },
        //{id: 3 , name: 'แม่มณี' },
        //{id: 4 , name: 'Credit Card/Debit Card' },
        //{id: 4 , name: 'We Chat' },
        //{id: 4 , name: 'Alipay' },
    ]
    constructor(
        private _service : ReportService,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fb: FormBuilder,
    ) {
        this.form = this._fb.group({
            cashier: '',

        })
        this.exportForm = this._fb.group({
            startDate: '',
            endDate: '',
        })
    }

	loadCashier():void {
		this._service.getCashier().subscribe((resp: any)=>{
			this.cashiers = resp;
			console.log(resp);

		})
	}

    exportExcel() {
        this._service.exportExcelCashier('').subscribe({
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
		this.loadCashier();
        this.form.patchValue({
            cashier: ''
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
                            "orderNo": "",
                            "orderDate": "2024-03-12T09:21:10.716Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 2,
                            "createdAt": "2024-03-17T09:24:55.488Z",
                            "updatedAt": "2024-03-17T09:24:55.488Z",
                            "deletedAt": null,
                            "orderNo": "202403170001",
                            "orderDate": "2024-03-17T09:24:55.502Z",
                            "orderStatus": "select_payment",
                            "total": 1000,
                            "discount": 0,
                            "grandTotal": 1000
                        },
                        {
                            "id": 3,
                            "createdAt": "2024-03-17T13:40:49.535Z",
                            "updatedAt": "2024-03-17T13:40:49.535Z",
                            "deletedAt": null,
                            "orderNo": "202403170002",
                            "orderDate": "2024-03-17T13:40:49.547Z",
                            "orderStatus": "select_payment",
                            "total": 1001,
                            "discount": 0,
                            "grandTotal": 1001
                        },
                        {
                            "id": 6,
                            "createdAt": "2024-03-17T19:39:35.101Z",
                            "updatedAt": "2024-03-17T19:39:35.101Z",
                            "deletedAt": null,
                            "orderNo": "202403170001",
                            "orderDate": "2024-03-17T19:39:35.117Z",
                            "orderStatus": "select_payment",
                            "total": 1001,
                            "discount": 0,
                            "grandTotal": 1001
                        },
                        {
                            "id": 7,
                            "createdAt": "2024-03-17T19:40:59.169Z",
                            "updatedAt": "2024-03-17T19:40:59.169Z",
                            "deletedAt": null,
                            "orderNo": "202403170002",
                            "orderDate": "2024-03-17T19:40:59.204Z",
                            "orderStatus": "select_payment",
                            "total": 1509.1,
                            "discount": 0,
                            "grandTotal": 1509.1
                        },
                        {
                            "id": 28,
                            "createdAt": "2024-03-18T05:32:32.367Z",
                            "updatedAt": "2024-03-18T05:32:32.367Z",
                            "deletedAt": null,
                            "orderNo": "202403170003",
                            "orderDate": "2024-03-18T05:32:32.386Z",
                            "orderStatus": "select_payment",
                            "total": 797.05,
                            "discount": 0,
                            "grandTotal": 797.05
                        },
                        {
                            "id": 29,
                            "createdAt": "2024-03-18T07:08:20.960Z",
                            "updatedAt": "2024-03-18T07:08:20.960Z",
                            "deletedAt": null,
                            "orderNo": "202403180004",
                            "orderDate": "2024-03-18T07:08:20.972Z",
                            "orderStatus": "select_payment",
                            "total": 732.05,
                            "discount": 0,
                            "grandTotal": 732.05
                        },
                        {
                            "id": 30,
                            "createdAt": "2024-03-18T07:44:52.849Z",
                            "updatedAt": "2024-03-18T07:44:52.849Z",
                            "deletedAt": null,
                            "orderNo": "202403180005",
                            "orderDate": "2024-03-18T07:44:52.861Z",
                            "orderStatus": "select_payment",
                            "total": 692.05,
                            "discount": 0,
                            "grandTotal": 692.05
                        },
                        {
                            "id": 31,
                            "createdAt": "2024-03-18T09:22:08.480Z",
                            "updatedAt": "2024-03-18T09:22:08.480Z",
                            "deletedAt": null,
                            "orderNo": "202403180006",
                            "orderDate": "2024-03-18T09:22:08.493Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 32,
                            "createdAt": "2024-03-18T09:22:10.459Z",
                            "updatedAt": "2024-03-18T09:22:10.459Z",
                            "deletedAt": null,
                            "orderNo": "202403180007",
                            "orderDate": "2024-03-18T09:22:10.470Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 33,
                            "createdAt": "2024-03-18T09:30:07.683Z",
                            "updatedAt": "2024-03-18T09:30:07.683Z",
                            "deletedAt": null,
                            "orderNo": "202403180008",
                            "orderDate": "2024-03-18T09:30:07.692Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 34,
                            "createdAt": "2024-03-18T12:31:07.336Z",
                            "updatedAt": "2024-03-18T12:31:07.336Z",
                            "deletedAt": null,
                            "orderNo": "202403180009",
                            "orderDate": "2024-03-18T12:31:07.343Z",
                            "orderStatus": "select_payment",
                            "total": 732.05,
                            "discount": 0,
                            "grandTotal": 732.05
                        },
                        {
                            "id": 35,
                            "createdAt": "2024-03-20T04:26:45.879Z",
                            "updatedAt": "2024-03-20T04:26:45.879Z",
                            "deletedAt": null,
                            "orderNo": "202403200001",
                            "orderDate": "2024-03-20T04:26:45.888Z",
                            "orderStatus": "select_payment",
                            "total": 1519.1,
                            "discount": 0,
                            "grandTotal": 1519.1
                        },
                        {
                            "id": 36,
                            "createdAt": "2024-03-20T04:32:19.802Z",
                            "updatedAt": "2024-03-20T04:32:19.802Z",
                            "deletedAt": null,
                            "orderNo": "202403200002",
                            "orderDate": "2024-03-20T04:32:19.814Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 37,
                            "createdAt": "2024-03-20T04:36:40.293Z",
                            "updatedAt": "2024-03-20T04:36:40.293Z",
                            "deletedAt": null,
                            "orderNo": "202403200003",
                            "orderDate": "2024-03-20T04:36:40.306Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 38,
                            "createdAt": "2024-03-20T04:39:18.353Z",
                            "updatedAt": "2024-03-20T04:39:18.353Z",
                            "deletedAt": null,
                            "orderNo": "202403200004",
                            "orderDate": "2024-03-20T04:39:18.376Z",
                            "orderStatus": "select_payment",
                            "total": 1639.1,
                            "discount": 0,
                            "grandTotal": 1639.1
                        },
                        {
                            "id": 39,
                            "createdAt": "2024-03-20T04:43:56.511Z",
                            "updatedAt": "2024-03-20T04:43:56.511Z",
                            "deletedAt": null,
                            "orderNo": "202403200005",
                            "orderDate": "2024-03-20T04:43:56.522Z",
                            "orderStatus": "select_payment",
                            "total": 1639.1,
                            "discount": 0,
                            "grandTotal": 1639.1
                        },
                        {
                            "id": 40,
                            "createdAt": "2024-03-20T04:44:35.346Z",
                            "updatedAt": "2024-03-20T04:44:35.346Z",
                            "deletedAt": null,
                            "orderNo": "202403200006",
                            "orderDate": "2024-03-20T04:44:35.354Z",
                            "orderStatus": "select_payment",
                            "total": 3433.2,
                            "discount": 0,
                            "grandTotal": 3433.2
                        },
                        {
                            "id": 41,
                            "createdAt": "2024-03-20T04:45:24.688Z",
                            "updatedAt": "2024-03-20T04:45:24.688Z",
                            "deletedAt": null,
                            "orderNo": "202403200007",
                            "orderDate": "2024-03-20T04:45:24.734Z",
                            "orderStatus": "select_payment",
                            "total": 3433.2,
                            "discount": 0,
                            "grandTotal": 3433.2
                        },
                        {
                            "id": 42,
                            "createdAt": "2024-03-20T04:49:15.712Z",
                            "updatedAt": "2024-03-20T04:49:15.712Z",
                            "deletedAt": null,
                            "orderNo": "202403200008",
                            "orderDate": "2024-03-20T04:49:15.720Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 43,
                            "createdAt": "2024-03-20T04:49:26.210Z",
                            "updatedAt": "2024-03-20T04:49:26.210Z",
                            "deletedAt": null,
                            "orderNo": "202403200009",
                            "orderDate": "2024-03-20T04:49:26.221Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 44,
                            "createdAt": "2024-03-20T04:55:52.164Z",
                            "updatedAt": "2024-03-20T04:55:52.164Z",
                            "deletedAt": null,
                            "orderNo": "202403200010",
                            "orderDate": "2024-03-20T04:55:52.172Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 45,
                            "createdAt": "2024-03-20T04:59:10.805Z",
                            "updatedAt": "2024-03-20T04:59:10.805Z",
                            "deletedAt": null,
                            "orderNo": "202403200011",
                            "orderDate": "2024-03-20T04:59:10.815Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 46,
                            "createdAt": "2024-03-20T05:01:17.457Z",
                            "updatedAt": "2024-03-20T05:01:17.457Z",
                            "deletedAt": null,
                            "orderNo": "202403200012",
                            "orderDate": "2024-03-20T05:01:17.466Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 47,
                            "createdAt": "2024-03-20T05:03:21.252Z",
                            "updatedAt": "2024-03-20T05:03:21.252Z",
                            "deletedAt": null,
                            "orderNo": "202403200013",
                            "orderDate": "2024-03-20T05:03:21.261Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 48,
                            "createdAt": "2024-03-20T05:04:09.827Z",
                            "updatedAt": "2024-03-20T05:04:09.827Z",
                            "deletedAt": null,
                            "orderNo": "202403200014",
                            "orderDate": "2024-03-20T05:04:09.858Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 49,
                            "createdAt": "2024-03-20T05:06:06.988Z",
                            "updatedAt": "2024-03-20T05:06:06.988Z",
                            "deletedAt": null,
                            "orderNo": "202403200015",
                            "orderDate": "2024-03-20T05:06:07.000Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 50,
                            "createdAt": "2024-03-20T05:08:09.387Z",
                            "updatedAt": "2024-03-20T05:08:09.387Z",
                            "deletedAt": null,
                            "orderNo": "202403200016",
                            "orderDate": "2024-03-20T05:08:09.394Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 51,
                            "createdAt": "2024-03-20T05:09:21.633Z",
                            "updatedAt": "2024-03-20T05:09:21.633Z",
                            "deletedAt": null,
                            "orderNo": "202403200017",
                            "orderDate": "2024-03-20T05:09:21.667Z",
                            "orderStatus": "select_payment",
                            "total": 0,
                            "discount": 0,
                            "grandTotal": 0
                        },
                        {
                            "id": 52,
                            "createdAt": "2024-03-20T10:18:23.752Z",
                            "updatedAt": "2024-03-20T10:18:23.752Z",
                            "deletedAt": null,
                            "orderNo": "202403200018",
                            "orderDate": "2024-03-20T10:18:23.758Z",
                            "orderStatus": "select_payment",
                            "total": 797.05,
                            "discount": 0,
                            "grandTotal": 797.05
                        },
                        {
                            "id": 53,
                            "createdAt": "2024-03-20T10:21:59.310Z",
                            "updatedAt": "2024-03-20T10:21:59.310Z",
                            "deletedAt": null,
                            "orderNo": "202403200019",
                            "orderDate": "2024-03-20T10:21:59.317Z",
                            "orderStatus": "select_payment",
                            "total": 742.05,
                            "discount": 0,
                            "grandTotal": 742.05
                        },
                        {
                            "id": 54,
                            "createdAt": "2024-03-20T10:23:46.377Z",
                            "updatedAt": "2024-03-20T10:23:46.377Z",
                            "deletedAt": null,
                            "orderNo": "202403200020",
                            "orderDate": "2024-03-20T10:23:46.386Z",
                            "orderStatus": "select_payment",
                            "total": 1127.05,
                            "discount": 0,
                            "grandTotal": 1127.05
                        },
                        {
                            "id": 55,
                            "createdAt": "2024-03-20T10:27:20.131Z",
                            "updatedAt": "2024-03-20T10:27:20.131Z",
                            "deletedAt": null,
                            "orderNo": "202403200021",
                            "orderDate": "2024-03-20T10:27:20.142Z",
                            "orderStatus": "select_payment",
                            "total": 787.05,
                            "discount": 0,
                            "grandTotal": 787.05
                        },
                        {
                            "id": 56,
                            "createdAt": "2024-03-20T11:38:21.891Z",
                            "updatedAt": "2024-03-20T11:38:21.891Z",
                            "deletedAt": null,
                            "orderNo": "202403200022",
                            "orderDate": "2024-03-20T11:38:21.907Z",
                            "orderStatus": "select_payment",
                            "total": 1374.1,
                            "discount": 0,
                            "grandTotal": 1374.1
                        },
                        {
                            "id": 57,
                            "createdAt": "2024-03-20T11:38:34.237Z",
                            "updatedAt": "2024-03-20T11:38:34.237Z",
                            "deletedAt": null,
                            "orderNo": "202403200023",
                            "orderDate": "2024-03-20T11:38:34.259Z",
                            "orderStatus": "select_payment",
                            "total": 1374.1,
                            "discount": 0,
                            "grandTotal": 1374.1
                        },
                        {
                            "id": 58,
                            "createdAt": "2024-03-20T11:39:06.590Z",
                            "updatedAt": "2024-03-20T11:39:06.590Z",
                            "deletedAt": null,
                            "orderNo": "202403200024",
                            "orderDate": "2024-03-20T11:39:06.599Z",
                            "orderStatus": "select_payment",
                            "total": 2121.1499999999996,
                            "discount": 0,
                            "grandTotal": 2121.1499999999996
                        },
                        {
                            "id": 59,
                            "createdAt": "2024-03-20T11:45:44.462Z",
                            "updatedAt": "2024-03-20T11:45:44.462Z",
                            "deletedAt": null,
                            "orderNo": "202403200025",
                            "orderDate": "2024-03-20T11:45:44.473Z",
                            "orderStatus": "select_payment",
                            "total": 2121.1499999999996,
                            "discount": 0,
                            "grandTotal": 2121.1499999999996
                        },
                        {
                            "id": 60,
                            "createdAt": "2024-03-20T11:45:44.638Z",
                            "updatedAt": "2024-03-20T11:45:44.638Z",
                            "deletedAt": null,
                            "orderNo": "202403200026",
                            "orderDate": "2024-03-20T11:45:44.643Z",
                            "orderStatus": "select_payment",
                            "total": 2121.1499999999996,
                            "discount": 0,
                            "grandTotal": 2121.1499999999996
                        },
                        {
                            "id": 61,
                            "createdAt": "2024-03-20T11:52:15.434Z",
                            "updatedAt": "2024-03-20T11:52:15.434Z",
                            "deletedAt": null,
                            "orderNo": "202403200027",
                            "orderDate": "2024-03-20T11:52:15.443Z",
                            "orderStatus": "select_payment",
                            "total": 2783.2,
                            "discount": 0,
                            "grandTotal": 2783.2
                        },
                        {
                            "id": 62,
                            "createdAt": "2024-03-20T11:53:00.566Z",
                            "updatedAt": "2024-03-20T11:53:00.566Z",
                            "deletedAt": null,
                            "orderNo": "202403200028",
                            "orderDate": "2024-03-20T11:53:00.586Z",
                            "orderStatus": "select_payment",
                            "total": 2783.2,
                            "discount": 0,
                            "grandTotal": 2783.2
                        },
                        {
                            "id": 63,
                            "createdAt": "2024-03-20T11:53:00.714Z",
                            "updatedAt": "2024-03-20T11:53:00.714Z",
                            "deletedAt": null,
                            "orderNo": "202403200029",
                            "orderDate": "2024-03-20T11:53:00.734Z",
                            "orderStatus": "select_payment",
                            "total": 2783.2,
                            "discount": 0,
                            "grandTotal": 2783.2
                        },
                        {
                            "id": 64,
                            "createdAt": "2024-03-20T11:53:01.257Z",
                            "updatedAt": "2024-03-20T11:53:01.257Z",
                            "deletedAt": null,
                            "orderNo": "202403200030",
                            "orderDate": "2024-03-20T11:53:01.277Z",
                            "orderStatus": "select_payment",
                            "total": 2783.2,
                            "discount": 0,
                            "grandTotal": 2783.2
                        },
                        {
                            "id": 66,
                            "createdAt": "2024-03-20T14:48:21.080Z",
                            "updatedAt": "2024-03-20T14:48:21.080Z",
                            "deletedAt": null,
                            "orderNo": "202403200032",
                            "orderDate": "2024-03-20T14:48:21.091Z",
                            "orderStatus": "select_payment",
                            "total": 722.05,
                            "discount": 0,
                            "grandTotal": 722.05
                        },
                        {
                            "id": 65,
                            "createdAt": "2024-03-20T14:16:40.916Z",
                            "updatedAt": "2024-03-20T15:33:33.536Z",
                            "deletedAt": null,
                            "orderNo": "202403200031",
                            "orderDate": "2024-03-20T14:16:40.927Z",
                            "orderStatus": "wait_payment",
                            "total": 1000,
                            "discount": 0,
                            "grandTotal": 1000
                        },
                        {
                            "id": 68,
                            "createdAt": "2024-03-20T16:38:26.241Z",
                            "updatedAt": "2024-03-20T16:38:26.241Z",
                            "deletedAt": null,
                            "orderNo": "202403200034",
                            "orderDate": "2024-03-20T16:38:26.247Z",
                            "orderStatus": "select_payment",
                            "total": 687.05,
                            "discount": 0,
                            "grandTotal": 687.05
                        },
                        {
                            "id": 69,
                            "createdAt": "2024-03-20T16:40:06.112Z",
                            "updatedAt": "2024-03-20T16:40:13.683Z",
                            "deletedAt": null,
                            "orderNo": "202403200035",
                            "orderDate": "2024-03-20T16:40:06.120Z",
                            "orderStatus": "wait_payment",
                            "total": 702.05,
                            "discount": 0,
                            "grandTotal": 702.05
                        },
                        {
                            "id": 67,
                            "createdAt": "2024-03-20T16:09:40.258Z",
                            "updatedAt": "2024-03-20T16:47:12.917Z",
                            "deletedAt": null,
                            "orderNo": "202403200033",
                            "orderDate": "2024-03-20T16:09:40.268Z",
                            "orderStatus": "wait_payment",
                            "total": 737.05,
                            "discount": 0,
                            "grandTotal": 737.05
                        },
                        {
                            "id": 70,
                            "createdAt": "2024-03-20T17:03:49.361Z",
                            "updatedAt": "2024-03-20T17:04:01.842Z",
                            "deletedAt": null,
                            "orderNo": "202403200001",
                            "orderDate": "2024-03-20T17:03:49.369Z",
                            "orderStatus": "wait_payment",
                            "total": 722.05,
                            "discount": 0,
                            "grandTotal": 722.05
                        }
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
                title: 'Order No',
                data: 'orderNo',
                render: function (data, type, row) {
                    if (data === null || data === undefined || data === '') {
                        return '-';
                    }
                    return 'เงินสด';
                },
                className: 'text-center'
            },
             {
                title: 'Order No',
                data: 'orderNo',
                render: function (data, type, row) {
                    if (data === null || data === undefined || data === '') {
                        return '-';
                    }
                    return data;
                },
                className: 'text-center'
            },
            {
                title: 'รวม',
                data: 'total',
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
                title: 'ส่วนลด',
                data: 'discount',
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
                title: "วันที่ทำรายการ",
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
