import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AgentGroupService {
    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }

    update(data: any,id: any) {
        return this.http.put('/api/member/' + id, data)
    }

    getRole() {
        return this.http.get('/api/role').pipe(
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
    getUnit() {
        return this.http.get('/api/unit').pipe(
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
        return this.http.post('/api/member_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
    get(id: number) {
        return this.http.get(
            environment.apiUrl + '/api/member/' + id
        );
    }

    create(data: any) {
        return this.http.post(
            environment.apiUrl + '/api/member',
            data
        );
    }

    delete(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/member/' + id
        );
    }

    getAgent() {
        return this.http.get(
            environment.apiUrl + '/api/get_agent'
        );
    }
    getThaiTransport() {
        return this.http.get(
            environment.apiUrl + '/api/get_transport'
        );
    }

    createAddress(data: any) {
        return this.http.post('/api/member_address', data)
    }

    updateAddress(data: any) {
        return this.http.put('/api/update_member_address/' + data.id, data)
    }

    deleteAddress(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/member_address/' + id
        );
    }
    upload_image(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_images', data)
    }
    upload_file(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_file', data)
    }
}
