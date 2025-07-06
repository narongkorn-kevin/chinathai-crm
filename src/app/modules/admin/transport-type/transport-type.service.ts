import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TransportTypeService {

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
    datatable(dataTablesParameters: any) {
        const resp = {
            data: {
                data: [
                    { No: 1, code: 'TAO', nameTh: 'Taobao', nameCn: 'Taobao', nameEn: 'Taobao', url: 'https://google.co.th', image: 'https://placehold.co/600x400' }
                ],
                total: 10,
            }
        }

        return of(resp);


        // return this.http.post('/api/member_page', dataTablesParameters).pipe(
        //     map((resp: any) => {
        //         return resp;
        //     })
        // );
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
}
