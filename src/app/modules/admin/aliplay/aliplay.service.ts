import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AliplayService {
    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }

    update(data: any) {
        return this.http.put('/api/member', data)
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
        return this.http.post('/api/alipay_payment_page', dataTablesParameters).pipe(
            map((resp: any) => {
                // ตรวจสอบว่ามีข้อมูลหรือไม่
                if (Array.isArray(resp.data.data)) {
                    resp.data.data = resp.data.data.map((item: any) => {
                        const code = item.member?.code ?? '';
                        const fname = item.member?.fname ?? '';
                        const lname = item.member?.lname ?? '';
                        const amount = parseFloat(item.amount) || 0;
                        const fee = parseFloat(item.fee) || 0;
                        const total = parseFloat((amount + fee).toFixed(4)); // ทำให้เป็นทศนิยม 2 ตำแหน่ง

                        // ตรวจสอบ image_url
                        // สร้าง fullImageUrl
                        let fullImageSlip: string | null = null;
                        if (item.image_slip) {
                            const baseUrl = environment.apiUrl;
                            fullImageSlip = `${baseUrl}/${item.image_slip}`;
                        }

                        let fullImage: string | null = null;
                        if (item.image) {
                            const baseUrl = environment.apiUrl;
                            fullImage = `${baseUrl}/${item.image}`;
                        }
                        let fullImageQr: string | null = null;
                        if (item.image_qr_code) {
                            const baseUrl = environment.apiUrl;
                            fullImageQr = `${baseUrl}/${item.image_qr_code}`;
                        }
                        return {
                            ...item,
                            fullname: `${code} ${fname} ${lname}`.trim(),
                            total: total,
                            fullImageSlip: fullImageSlip,
                            fullImage: fullImage,
                            fullImageQr: fullImageQr,
                        };
                    });
                }
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
            environment.apiUrl + '/api/alipay_payment',
            data
        );
    }

    delete(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/alipay_payment/' + id
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
            environment.apiUrl + '/api/alipay_payment/' + id
        );
    }

    updateStatus(data: any) {
        return this.http.post('/api/update_status_alipay_payment', data)
    }

    updatePayment(data: any) {
        return this.http.put('/api/alipay_payment/' + data.id, data)
    }

    updateSlip(data: any) {
        return this.http.put('/api/slip_alipay_payment/' + data.id, data)
    }

    getMember() {
        return this.http.get(environment.apiUrl + '/api/get_member')
    }

}
