import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LotService {
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

    datatablePoNonePackingList(dataTablesParameters: any) {
        return this.http
            .post('/api/delivery_order_list_none_packing_list', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }

    datatablePoNonePackingListNew(dataTablesParameters: any) {
        return this.http
            .post('/api/delivery_order_list_item_in_pallet_or_sack_none_packing_list', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    
                    return resp;
                })
            );
    }


    create(data: any) {
        return this.http.post('/api/packing_list', data);
    }

    update(data: any, id: any) {
        return this.http.put('/api/packing_list/' + id, data);
    }
    
    deleteItemInPackinglist(id: any) {
        return this.http.put('/api/delete_item_in_packing_list/' + id , {});
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
    getDeliveryOrdersListInPallet() {
        return this.http.get('/api/get_delivery_order_list_in_pallet');
    }
    getDashboardPacking() {
        return this.http.get('/api/dashboard_packing');
    }
    getDashboardPackingFilter(param: any) {
        return this.http.get('/api/dashboard_packing', {params:param});
    }
    addOrder(data: any) {
        return this.http.post('/api/packing_list_order_list', data);
    }
    changePackingList(data: any) {
        return this.http.post('/api/change_packing_list_order_list', data);
    }
    getCode() {
        return this.http.get('/api/get_last_code_packing_list_pallet_sack/packing_list');
    }

    getStore() {
        return this.http.get('/api/get_store');
    }
    getDashboardById(id: any) {
        return this.http.get('/api/dashboard_delivery_order_by_packing_list/' + id);
    }

    createImagePackingList(data: any) {
        return this.http.post('/api/upload_packing_list_images', data);
    }

    upload_image(data: any) {
        return this.http.post('/api/upload_images', data)
    }

    deleteImage(data: any) {
        return this.http.post('/api/delete_packing_list_images', data);
    }

    updateStatusPackingList(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_status_packing_list', data)
    }
}
