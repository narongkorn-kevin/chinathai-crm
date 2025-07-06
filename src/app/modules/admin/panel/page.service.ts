import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _category: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private product: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

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

    return this.http.get('/api/panel/datatables', {
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
    return this.http.post('/api/panel', data)
  }

  update(id: any,data: any) {
    return this.http.put('/api/panel/' + id, data)
  }

  getRole() {
    return this.http.get('/api/role').pipe(
      tap((resp: any) => {
        this._roles.next(resp);
      }),
    )
  }

  getById(id:any) {
    return this.http.get('/api/panel/' + id).pipe(
      tap((resp: any) => {
        this._branch.next(resp);
      }),
    )
  }
  getBranch() {
    return this.http.get('/api/panel').pipe(
      tap((resp: any) => {
        this._branch.next(resp);
      }),
    )
  }

  delete(id: number) {
    return this.http.delete('/api/panel/' + id)
  }

  getCategory() {
    return this.http.get('/api/category').pipe(
      tap((resp: any) => {
        this._category.next(resp);
      }),
    )
  }
  getProduct(data: any) {
    return this.http.get('/api/product', {
      params: {
        categoryId: data
    }
  }).pipe(
      tap((resp: any) => {
        this.product.next(resp);
      }),
    )
  }
}
