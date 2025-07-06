import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportListService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    const { columns, order, search, start, length } = dataTablesParameters;
    const page = start / length + 1;
    const column = columns[order[0].column].data;
    const dir = toUpper(order[0].dir);
    const sortBy = column + ':' + dir;

    return this.http.get('/api/device/datatables', {
      params: {
        page: page,
        limit: length,
        sortBy: sortBy,
        search: search.value,
      }
    }).pipe(
      map((resp: any) => {
        resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
        return resp;
      })
    );
  }

  create(data: any) {
    return this.http.post('/api/device', data)
  }

  update(id: any,data: any) {
    return this.http.put('/api/device/' + id, data)
  }

  getRole() {
    return this.http.get('/api/role').pipe(
      tap((resp: any) => {
        this._roles.next(resp);
      }),
    )
  }

  getBranch() {
    return this.http.get('/api/branch').pipe(
      tap((resp: any) => {
        this._branch.next(resp);
      }),
    )
  }

  delete(id: number) {
    return this.http.delete('/api/device/' + id)
  }

  remainCreditDaialy(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/remain-credit-daily`, data, {
      responseType: 'blob'
    })
  }
  paymentTopup(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/payment/topup`, data, {
      responseType: 'blob'
    })  
  }

  tapSummaryDetail(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/tap-log/excel/summary/type`, data, {
      responseType: 'blob'
    })
  }

  tapSummaryShift(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/tap-log/excel/summary`, data, {
      responseType: 'blob'
    })
  }
  tapSummaryMember(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/excel/tab-card-summary`, data, {
      responseType: 'blob'
    })
  }
  tapLogToday(data:any) {
    return this.http.post(environment.apiUrl + `/api/tap-log/report-today`, data, {
      responseType: 'blob'
    })
  }
  paymentMethodHistory(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/excel/payment-method-history`, data, {
      responseType: 'blob'
    })
  }
  summaryPaidCard(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/excel/summary-paid-card`, data, {
      responseType: 'blob'
    })
  }
  cashierOutlet(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/excel/cashier-outlet`, data, {
      responseType: 'blob'
    })
  }
  cardMovementDetail(data:any) {
    return this.http.post(environment.apiUrl + `/api/report/excel/card-movement-detail`, data, {
      responseType: 'blob'
    })
  }
}
