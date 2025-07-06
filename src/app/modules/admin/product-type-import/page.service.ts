import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeImportService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    return this.http.post('/api/product_type_page', dataTablesParameters).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  create(data: any) {
    return this.http.post('/api/product_type', data)
  }

  update(id: any, data: any) {
    return this.http.put('/api/product_type/' + id, data)
  }

  get() {
    return this.http.get('/api/product_type')
  }
  
  getById(id: number) {
    return this.http.get('/api/product_type/' + id)
  }

  delete(id: number) {
    return this.http.delete('/api/product_type/' + id)
  }
}
