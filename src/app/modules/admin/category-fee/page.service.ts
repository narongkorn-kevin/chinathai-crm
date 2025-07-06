import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryFeeService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    return this.http.post('/api/category_fee_page', dataTablesParameters).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  create(data: any) {
    return this.http.post('/api/category_fee', data)
  }

  update(id: any, data: any) {
    return this.http.put('/api/category_fee/' + id, data)
  }

  get() {
    return this.http.get('/api/get_category_fee/DocumentImport')
  }
  
  getById(id: number) {
    return this.http.get('/api/category_fee/' + id)
  }

  delete(id: number) {
    return this.http.delete('/api/category_fee/' + id)
  }
}
