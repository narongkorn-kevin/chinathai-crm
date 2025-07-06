import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DeliveryNoteService {
    constructor(private http: HttpClient) {}

    datatable(dataTablesParameters: any) {
        return this.http
            .post('/api/shipment_page', dataTablesParameters)
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
        return this.http.post('/api/shipment_master', data);
    }

    update(data: any,id: any) {
        return this.http.put('/api/shipment_master/' + id, data);
    }

    get(id: any) {
        return this.http.get('/api/shipment_master/' + id);
    }
    getshipment(id: any) {
        return this.http.get('/api/shipment/' + id);
    }

    delete(id: number) {
        return this.http.delete('/api/shipment_master/' + id);
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
}
