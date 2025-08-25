import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PackagingService {

    constructor(private http: HttpClient) { }

    update(data: any) {
        return this.http.put('/api/member', data)
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
        return this.http.post('/api/packing_type', data)
    }

    updateAddress(data: any) {
        return this.http.put('/api/packing_type/' + data.id, data)
    }

    deleteAddress(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/member_address/' + id
        );
    }

    datatable(dataTablesParameters: any) {
        return this.http.post('/api/packing_type_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
}
