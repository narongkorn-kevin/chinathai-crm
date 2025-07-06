import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }

  // datatable(dataTablesParameters: any) {
  //   const { start, length } = dataTablesParameters;
  //   const page = start / length + 1;
  //   return this.http.get('/api/user/datatables', {
  //     params: {
  //       limit: length,
  //       page: page,
  //     }
  //   }).pipe(
  //     map((resp: any) => {
  //       resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
  //       return resp;
  //     })
  //   );
  // }

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

  create(data: any) {
    return this.http.post('/api/order', data)
  }

  update(id: any,data: any) {
    return this.http.put('/api/order/' + id, data)
  }

  getById(id: any) {
    return this.http.get('/api/order/' + id)
  }

  delete(id: number) {
    return this.http.delete('/api/order/' + id)
  }

  import(data: FormData) {
    return this.http.post('/api/member/import-excel-credit', data)
  }

  export(data:any) {
    return this.http.post(`/api/member/export/credit/excel`, {}, {
      responseType: 'blob'
    })
  }

  voidOrder(id: any){
    return this.http.post(`/api/order/${id}/void`,'')
  }
}
