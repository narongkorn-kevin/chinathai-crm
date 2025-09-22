import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CouponService {
  constructor(private http: HttpClient) {}

  // Datatables endpoint via POST as requested
  datatable(dataTablesParameters: any) {
    return this.http.post('/api/coupon_page', dataTablesParameters).pipe(
      map((resp: any) => resp)
    );
  }

  create(data: any) {
    return this.http.post('/api/coupon', data);
  }

  update(id: any, data: any) {
    return this.http.put('/api/coupon/' + id, data);
  }

  get(id: any) {
    return this.http.get('/api/coupon/' + id);
  }

  delete(id: any) {
    return this.http.delete('/api/coupon/' + id);
  }
}

