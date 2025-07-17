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
            .post('/api/bills_page', dataTablesParameters)
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
        return this.http.post('/api/bills', data);
    }

      updateTranspot(id,data: any) {
        return this.http.put('/api/bills11/' + id, data);
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
    getDeliveryDocByBill(id:number) {
        return this.http.get('/api/get_delivery_doc_by_bill/'+id);
    }
}
