import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private http: HttpClient) { }

    updateOrderProductStatus(data: { status: string, orders: number[] }) {
        return this.http.post(environment.apiUrl + '/api/update_status_order', data)
    }

    updateImportProductOrderStatus(data: { status: string, orders: number[] }) {
        return this.http.post(environment.apiUrl + '/api/update_status_import_product_order', data)
    }
}
