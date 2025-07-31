import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    constructor(private http: HttpClient) {}

    datatable(dataTablesParameters: any) {
        return this.http
            .post('/api/bills_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }
    datatablepo(dataTablesParameters: any) {
        return this.http
            .post('/api/delivery_orders_thai_page', dataTablesParameters)
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
        return this.http.post('/api/bills', data);
    }

    updatePrice(id: any,data: any) {
        return this.http.put('/api/bills/' + id, data);
    }


    updateStatusBill(data: any) {
        return this.http.post('/api/update_status_bill', data);
    }
    paymentOrder(data: any) {
        return this.http.post('/api/payment_order', data);
    }

    update(data: any,id: any) {
        return this.http.put('/api/bills/' + id, data);
    }

    get(id: any) {
        return this.http.get('/api/bills/' + id);
    }
    getshipment(id: any) {
        return this.http.get('/api/shipment/' + id);
    }

    delete(id: number) {
        return this.http.delete('/api/bills/' + id);
    }

    getShipment() {
        return this.http.get('/api/get_shipment_master');
    }
    getProductType() {
        return this.http.get('/api/get_product_type');
    }
    getTransport() {
        return this.http.get('/api/get_transport');
    }
    getPackingList() {
        return this.http.get('/api/get_packing_list');
    }
    getPackingListInthai() {
        return this.http.get('/api/get_packing_list_thai');
    }
    upload_image(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_images', data)
    }
    upload_file(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_file', data)
    }
}
