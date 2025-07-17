import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PalletService {
    constructor(private http: HttpClient) { }

    datatable(dataTablesParameters: any) {
        return this.http
            .post('/api/pallet_page', dataTablesParameters)
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
            .post('/api/delivery_order_list_none_pallet_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }

    // datatableorderlistBox(dataTablesParameters: any) {
    //     return this.http
    //         .post('/api/delivery_order_list_item_none_pallet_and_sack', dataTablesParameters)
    //         .pipe(
    //             map((resp: any) => {
    //                 return resp;
    //             })
    //         );
    // }

       datatableorderlistBox(dataTablesParameters: any) {
        return this.http
            .post('/api/delivery_order_list_item_sack_none_pallet_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }

    create(data: any) {
        return this.http.post('/api/pallet', data);
    }

    update(data: any, id: any) {
        return this.http.put('/api/pallet/' + id, data);
    }

    get(id: any) {
        return this.http.get('/api/pallet/' + id);
    }

    delete(id: number) {
        return this.http.delete('/api/pallet/' + id);
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
    getProductNonePallet() {
        return this.http.get('/api/get_delivery_order_list_none_pallet');
    }
    getDashboardPallet() {
        return this.http.get('/api/dashboard_pallet');
    }
    getDashboardPalletFilter(param: any) {
        return this.http.get('/api/dashboard_pallet', {params: param});
    }
    getCode() {
        return this.http.get('/api/get_last_code_packing_list_pallet_sack/pallet');
    }

    getMember() {
        return this.http.get('/api/get_member');
    }

}
