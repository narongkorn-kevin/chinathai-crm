import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DeliveryOrdersService {
    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) {}

    update(id: number,data: any) {
        return this.http.put('/api/delivery_orders/'+ id, data)
      }

    getRole() {
        return this.http.get('/api/role').pipe(
            tap((resp: any) => {
                this._roles.next(resp);
            })
        );
    }
    getProductType() {
        return this.http.get('/api/get_product_type').pipe(
            tap((resp: any) => {
                this._roles.next(resp);
            })
        );
    }
    getStandardSize() {
        return this.http.get('/api/get_standard_size').pipe(
            tap((resp: any) => {
                this._roles.next(resp);
            })
        );
    }
    getTransport() {
        return this.http.get('/api/get_transport').pipe(
            tap((resp: any) => {
                this._roles.next(resp);
            })
        );
    }
    getOrder() {
        return this.http.get('/api/get_orders').pipe(
            tap((resp: any) => {
                this._roles.next(resp);
            })
        );
    }
    getUnit() {
        return this.http.get('/api/get_product_type').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    getCategory() {
        return this.http.get('/api/category').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    getProductDraft() {
        return this.http.get('/api/get_product_draft').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    getAddOnServices() {
        return this.http.get('/api/get_add_on_services').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    getmember() {
        return this.http.get('/api/get_member').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    getstore() {
        return this.http.get('/api/get_store').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    getcategory_product() {
        return this.http.get('/api/get_category_product').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    getById(id: string) {
        return this.http.get('/api/member/' + id).pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }

    import(data: FormData) {
        return this.http.post('/api/member/import-excel', data);
    }
    export(data: any) {
        return this.http.post(`/api/member/export/excel`, data, {
            responseType: 'blob',
        });
    }

    createCredit(data: any, id: any) {
        return this.http.post('/api/member/' + id + '/topup', data);
    }
    //=========================================================================================================
    datatable(dataTablesParameters: any) {
        return this.http.post('/api/delivery_orders_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
    datatablesetting(dataTablesParameters: any) {
        return this.http.post('/api/standard_size_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
    datatatacking(dataTablesParameters: any) {
        return this.http.post('/api/tracking_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
    datataproductdraft(dataTablesParameters: any) {
        return this.http.post('/api/product_draft_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
    getsetting() {
        return this.http.get('/api/get_standard_size').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }
    gettacking() {
        return this.http.get('/api/get_tracking').pipe(
            tap((resp: any) => {
                this._data.next(resp);
            })
        );
    }


    get(id: number) {
        return this.http.get(
            environment.apiUrl + '/api/delivery_orders/' + id
        );
    }

    create(data: any) {
        return this.http.post(
            environment.apiUrl + '/api/delivery_orders',
            data
        );
    }
    createTracking(data: any) {
        return this.http.post(
            environment.apiUrl + '/api/tracking',
            data
        );
    }
    createpo(data: any) {
        return this.http.post(
            environment.apiUrl + '/api/product_draft',
            data
        );
    }

    delete(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/delivery_orders/' + id
        );
    }
    deletesetting(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/standard_size/' + id
        );
    }
    deletepo(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/product_draft/' + id
        );
    }
    deletetack(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/tracking/' + id
        );
    }

    updatesetting(data: any, id: number) {
        return this.http.put('/api/standard_size/'+ id, data)
      }
    updatepo(data: any, id: number) {
        return this.http.put('/api/product_draft/'+ id, data)
      }
}
