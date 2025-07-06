import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/modules/common/helper';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);
    constructor(
        private http: HttpClient,
    ) { }
    datatable(dataTablesParameters: any) {
        const { columns, order, search, start, length, filter } = dataTablesParameters;
        const page = start / length + 1;
        const column = columns[order[0].column].data;
        const dir = toUpper(order[0].dir);
        const sortBy = column + ':' + dir;


        return this.http.get('/api/order/datatables', {
            params: {
                page: page,
                limit: length,
                sortBy: sortBy,
                search: search.value,
                ...removeEmpty(filter)
            }
        }).pipe(
            map((resp: any) => {
                resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
                return resp;
            })
        );
    }
    create(daatabranch: { code: string, name: string, storeId: number, address: string, }) {
        return this.http.post('/api/product', {
            "code": daatabranch.code,
            "name": daatabranch.name,
            "storeId": daatabranch.storeId,
            "address": daatabranch.address,

        })
    }

    orderPdf(data:any) {
        return this.http.post(environment.apiUrl + `/api/tap-log/report-today`, data, {
          responseType: 'blob'
        })
      }
    tapSummary(data:any) {
        return this.http.post(environment.apiUrl + `/api/report/tap-log/excel/summary`, data, {
          responseType: 'blob'
        })
      }

      tapSummaryDetail(data:any) {
        return this.http.post(environment.apiUrl + `/api/report/tap-log/excel/summary/type`, data, {
          responseType: 'blob'
        })
      }
      topupSummary(data:any) {
        return this.http.post(environment.apiUrl + `/api/report/excel/top-up-history`, data, {
          responseType: 'blob'
        })
      }
      creditSummaryToday(data:any) {
        return this.http.post(environment.apiUrl + `/api/report/order/excel/credit-date`, data, {
          responseType: 'blob'
        })
      }
      paymentSummary(data:any) {
        return this.http.post(environment.apiUrl + `/api/report/cardmovement`, data, {
          responseType: 'blob'
        })
      }
      paymentSummaryTopup(data:any) {
        return this.http.post(environment.apiUrl + `/api/report/payment/topup`, data, {
          responseType: 'blob'
        })
      }


    getStore(): Observable<any> {
        return this.http
            .get<any>(environment.apiUrl + '/api/product')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getUnit(): Observable<any> {
        return this.http
            .get<any>('/api/unit')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getUser(): Observable<any> {
        return this.http
            .get<any>('/api/user')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getOrder(): Observable<any> {
        return this.http
            .get<any>('/api/order')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getCategory(): Observable<any> {
        return this.http
            .get<any>('/api/category')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }
    getById(id: string): Observable<any> {
        return this.http
            .get<any>('/api/order/' + id)
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    delete(id: any) {
        return this.http.delete('/api/product/' + id)
    }
    getCashier(): Observable<any> {
        return this.http
            .get<any>('/api/user')
            .pipe(
                tap((result) => {
                    this._data.next(result);
                })
            );
    }

    // orderExcel(start: any, end: any) {
    //     return this.http.post('/api/report/order/excel', {
    //         startDate: start,
    //         endDate: end
    //     }, {
    //         responseType: 'blob'
    //     })
    // }

    exportExcelTotal(type: any) {
        // return this.http.post(environment.apiUrl + /api/person/export-excel, { type: type})
        return  this.http.post(environment.apiUrl + '/api/report/order/excel', {
                startDate: "2024-06-07",
                endDate: "2024-06-07",
                branchID: 0,
                categoryID: 0,
                productID: 0}, {
                responseType: 'blob'
                })
      }

    exportExcelPaymentType(type: any) {
    // return this.http.post(environment.apiUrl + /api/person/export-excel, { type: type})
    return  this.http.post(environment.apiUrl + '/api/report/order/excel/payment-type', {
                startDate: "2024-06-07",
                endDate: "2024-06-07",
                branchID: 0,
                categoryID: 0,
                productID: 0}, {
                responseType: 'blob'
                })
    }

    exportExcelCashier(type: any) {
    // return this.http.post(environment.apiUrl + /api/person/export-excel, { type: type})
    return  this.http.post(environment.apiUrl + '/api/report/order/excel/cashier', {
                startDate: "2024-06-07",
                endDate: "2024-06-07",
                branchID: 0,
                categoryID: 0,
                productID: 0}, {
                responseType: 'blob'
                })
    }

    exportExcelProductType(type: any) {
    // return this.http.post(environment.apiUrl + /api/person/export-excel, { type: type})
    return  this.http.post(environment.apiUrl + '/api/report/order/excel/branch-category', {
                startDate: "2024-06-07",
                endDate: "2024-06-04",
                branchID: 0,
                categoryID: 0,
                productID: 0}, {
                responseType: 'blob'
                })
    }

    exportExcelProduct(type: any) {
        // return this.http.post(environment.apiUrl + /api/person/export-excel, { type: type})
        return  this.http.post(environment.apiUrl + '/api/report/order/excel/branch-product', {
                    startDate: "2024-06-07",
                    endDate: "2024-06-04",
                    branchID: 0,
                    categoryID: 0,
                    productID: 0}, {
                    responseType: 'blob'
                    })
        }

    exportExcelBill(type: any) {
    // return this.http.post(environment.apiUrl + /api/person/export-excel, { type: type})
    return  this.http.post(environment.apiUrl + '/api/report/order/excel/branch', {
                startDate: "2024-06-07",
                endDate: "2024-06-07",
                branchID: 0,
                categoryID: 0,
                productID: 0}, {
                responseType: 'blob'
                })
    }
}
