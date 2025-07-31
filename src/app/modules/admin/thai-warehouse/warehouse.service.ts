import { data } from 'jquery';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WarehouseService {
    constructor(private http: HttpClient) { }

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

      datatableorderlistNotThai(dataTablesParameters: any) {
        return this.http
            .post('/api/delivery_order_list_in_packing_list_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }

    create(data: any) {
        return this.http.post('/api/warehouse', data);
    }

    update(data: any, id: any) {
        return this.http.put('/api/warehouse/' + id, data);
    }

    get(id: any) {
        return this.http.get('/api/warehouse/' + id);
    }

    delete(id: number) {
        return this.http.delete('/api/warehouse/' + id);
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
    getDashboardDeliveryOrdersThai() {
        return this.http.get('/api/dashboard_delivery_orders_thai');
    }

    getDashboardDeliveryOrdersThaiFilter(param: any) {
        return this.http.get('/api/dashboard_delivery_orders_thai', { params: param });
    }
    getPackingList() {
        return this.http.get('/api/get_packing_list');
    }
    getPackingListNotThai() {
        return this.http.get('/api/get_packing_list_not_thai');
    }
    deliveryOrdersThai(data: any) {
        return this.http.post('/api/delivery_orders_thai', data);
    }

    getPackingListById(id: any) {
        return this.http.get('/api/packing_list/' + id);
    }
    getStore() {
        return this.http.get('/api/get_store');
    }

    getMember() {
        return this.http.get('/api/get_member')
    }

     addItemToThaiStore(data: any) {
        return this.http.post('/api/delivery_orders_thai', data);
    }
}
