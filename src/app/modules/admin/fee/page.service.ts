import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    return this.http.post('/api/fee_page', dataTablesParameters).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  create(data: any) {
    return this.http.post('/api/fee', data)
  }

  update(id: any, data: any) {
    return this.http.put('/api/fee/' + id, data)
  }

  get() {
    return this.http.get('/api/fee')
  }
  
  getById(id: number) {
    return this.http.get('/api/fee/' + id)
  }

  delete(id: number) {
    return this.http.delete('/api/fee/' + id)
  }
}
