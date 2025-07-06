import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LotService {
    constructor(private http: HttpClient) {}

    datatable(dataTablesParameters: any) {
        return this.http
            .post('/api/packing_list_page', dataTablesParameters)
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
            .post('/api/delivery_order_list_in_pallet_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }

    create(data: any) {
        return this.http.post('/api/packing_list', data);
    }

    update(data: any,id: any) {
        return this.http.put('/api/packing_list/' + id, data);
    }

    get(id: any) {
        return this.http.get('/api/packing_list/' + id);
    }

    delete(id: number) {
        return this.http.delete('/api/packing_list/' + id);
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
    getPackingList() {
        return this.http.get('/api/get_packing_list');
    }
    addOrder(data: any) {
        return this.http.post('/api/packing_list_order_list', data);
    }
    changePackingList(data: any) {
        return this.http.post('/api/change_packing_list_order_list', data);
    }
}
