import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaplogService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    const { columns, order, search, start, length, filter } = dataTablesParameters;
    const page = start / length + 1;
    const column = columns[order[0].column].data;
    const dir = toUpper(order[0].dir);
    const sortBy = column + ':' + dir;

    return this.http.get('/api/tap-log/datatables', {
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
    return this.http.post('/api/tap-log', data)
  }

  update(id: any,data: any) { //น่าจะยังไม่แก้
    return this.http.put('/api/branch/' + id, data)
  }

  getRole() {
    return this.http.get('/api/role').pipe(
      tap((resp: any) => {
        this._roles.next(resp);
      }),
    )
  }

  getBranchId(id:any) {
    return this.http.get('/api/branch/' + id).pipe(
      tap((resp: any) => {
        this._branch.next(resp);
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

  delete(id: number) { //น่าจะยังไม่แก้
    return this.http.delete('/api/branch/' + id)
  }

  voidTaplog(id: number) { //น่าจะยังไม่แก้
    return this.http.post(`/api/tap-log/${id}/void`,'')
  }
}
