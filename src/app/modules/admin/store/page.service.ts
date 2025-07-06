import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoerService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _stores: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    const { start, length } = dataTablesParameters;
    const page = start / length + 1;
    return this.http.get('/api/store/datatables', {
      params: {
        limit: length,
        page: page,
      }
    }).pipe(
      map((resp: any) => {
        resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
        return resp;
      })
    );
  }

  create(data: any) {
    return this.http.post('/api/store', data)
  }

  update(id: any,data: any) {
    return this.http.put('/api/store/' + id, data)
  }

  getRole() {
    return this.http.get('/api/role').pipe(
      tap((resp: any) => {
        this._roles.next(resp);
      }),
    )
  }

  getStoreId(id:any) {
    return this.http.get('/api/store/'+ id).pipe(
      tap((resp: any) => {
        this._stores.next(resp);
      }),
    )
  }

  delete(id: number) {
    return this.http.delete('/api/store/' + id)
  }
}
