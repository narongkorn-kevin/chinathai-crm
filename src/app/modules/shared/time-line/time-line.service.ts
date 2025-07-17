import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimeLineService {

  constructor(
    private http: HttpClient,
  ) { }

  updateStatusPackingList(data: any) {
    return this.http.post(environment.apiUrl + '/api/update_status_packing_list', data)
  }

  updateStatusThaiWarehouse(data: any) {
    return this.http.post(environment.apiUrl + '/api/update_status_delivery_orders_thai', data)
  }
}
