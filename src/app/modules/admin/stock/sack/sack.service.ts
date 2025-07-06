import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SackService {
    constructor(private http: HttpClient) {}

    datatable(dataTablesParameters: any) {
        return this.http
            .post('/api/sack_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }
    datatablepo(dataTablesParameters: any) {
        return this.http
            .post('/api/delivery_orders_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }
    datatableorderlist(dataTablesParameters: any) {
        return this.http
            .post('/api/delivery_order_list_none_sack_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }

    create(data: any) {
        return this.http.post('/api/sack', data);
    }

    update(data: any,id: any) {
        return this.http.put('/api/sack/' + id, data);
    }

    get(id: any) {
        return this.http.get('/api/sack/' + id);
    }

    delete(id: number) {
        return this.http.delete('/api/sack/' + id);
    }
    getStandardSize() {
        return this.http.get('/api/get_standard_size');
    }

    getProductType() {
        return this.http.get('/api/get_product_type');
    }
    getTransport() {
        return this.http.get('/api/get_transport');
    }
    getProductNoneSack() {
        return this.http.get('/api/get_delivery_order_list_none_sack');
    }
}
