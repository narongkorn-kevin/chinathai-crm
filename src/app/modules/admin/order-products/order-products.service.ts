import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderProductsService {


    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    private _members: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    branches: any[] = [];
    selectedBranches: any[] = [];
    get categories$() {
        return this._categories.asObservable();
    }

    get members$() {
        return this._members.asObservable();
    }

    constructor(private http: HttpClient) {

     }

    datatable(dataTablesParameters: any) {
        return this.http.post('/api/orders_page', dataTablesParameters).pipe(
            map((resp: any) => {
                // ตรวจสอบว่ามีข้อมูลหรือไม่
                if (Array.isArray(resp.data.data)) {
                    resp.data.data = resp.data.data.map((item: any) => {
                        const code = item.member?.importer_code ?? '';
                        const fname = item.member?.fname ?? '';
                        const lname = item.member?.lname ?? '';
                        return {
                            ...item,
                            fullname: `${code} ${fname} ${lname}`.trim()
                        };
                    });
                }
                return resp;
            })
        );
    }
    get branches$() {
        return this._branch.asObservable();
    }
    create(data: any) {
        return this.http.post('/api/orders', data)
    }
    updateFee(data: any, id: any) {
        return this.http.put('/api/confirm_order/' + id, data)
    }

    update(data: any) {
        return this.http.post('/api/update_user', data)
    }

    delete(id: number) {
        return this.http.delete('/api/orders/' + id)
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/orders/' + id)
    }

    getMember() {
        return this.http.get(environment.apiUrl + '/api/get_member')
    }

    getMember$() {
        return this.http.get(environment.apiUrl + '/api/get_member')
            .pipe(
                map((resp: { data: any[] }) => ({
                    ...resp,
                    data: resp.data.map(e => ({
                        ...e,
                        fullname: `${e.code} ${e.fname} ${e.lname}`
                    }))
                })),
                tap((resp: { data: any[] }) => {
                    this._members.next(resp.data)
                })
            )
    }

    getMemberById(id: number) {
        return this.http.get(environment.apiUrl + '/api/member/' + id)
    }

    getAddOnService() {
        return this.http.get(environment.apiUrl + '/api/get_add_on_services')
    }
    getOrders() {
        return this.http.get(environment.apiUrl + '/api/get_orders')
    }

    updateStatus(data: { status: string, orders: number[] }) {
        return this.http.post(environment.apiUrl + '/api/update_status_order', data)
    }

    updateupdateTrackNo(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_track_no', data)
    }

    updateStatusOrderListAll(data: { order_lists: number[], status: 'waiting_for_review' | 'reviewed' | 'reject' }) {
        return this.http.post(environment.apiUrl + '/api/update_status_order_list_all', data)
    }

    //1688
    getCategory(q: string, page: number | 1, type: '1688' | 'taobao') {
        const url = type === 'taobao'
            ? 'https://api.icom.la/taobao/api/call.php'
            : 'https://api.icom.la/1688/api/call.php'

        return this.http.get(url, {
            params: {
                api_key: 'tegcargo06062024',
                item_search: '',
                q,
                page,
                lang: 'zh-CN',
                is_promotion: 1
            }
        })
    }

    getDetail(num_iid: string | number, type: '1688' | 'taobao') {
        const url = type === 'taobao'
            ? 'https://api.icom.la/taobao/api/call.php'
            : 'https://api.icom.la/1688/api/call.php'

        return this.http.get(url, {
            params: {
                api_key: 'tegcargo06062024',
                item_get: '',
                num_iid,
                lang: 'zh-CN',
                is_promotion: 1
            }
        })
    }

    createOrder(data: any) {
        return this.http.post(environment.apiUrl + '/api/orders', data)
    }

    //taobao
    upload(data: FormData) {
        return this.http.post(environment.apiUrl + '/api/upload_images', data)
    }

    uploadFile(data: FormData) {
        return this.http.post(environment.apiUrl + '/api/upload_file', data)
    }

    paymentOrder(data: any) {
        return this.http.post(environment.apiUrl + '/api/payment_order', data)
    }

    translateData(data: any) {
        return this.http.post(environment.apiUrl + '/api/translate', data)
    }

    translateBatch(texts: string[], sourceLang: string, targetLang: string): Observable<{ [original: string]: string }> {
  return this.http.post<{ translations: { [original: string]: string } }>(
    '/api/translate',
    { sourceLang, targetLang, texts }
  ).pipe(map(res => res.translations));
}

    getfee() {
        return this.http.get(environment.apiUrl + '/api/exchange-rate')
    }
}
