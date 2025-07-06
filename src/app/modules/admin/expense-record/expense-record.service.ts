import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExpenseRecordService {

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

    constructor(private http: HttpClient) { }
    datatable(dataTablesParameters: any) {
        const resp = {
            data: {
                data: [
                    { No: 1, code: 'A00001', total: 99999, date: '2025-01-01', nameTh: 'Taobao', nameCn: 'Taobao', nameEn: 'Taobao', url: 'https://google.co.th', image: 'https://placehold.co/600x400' }
                ],
                total: 10,
            }
        }

        return of(resp);

        // return this.http.post('/api/orders_page', dataTablesParameters).pipe(
        //     map((resp: any) => {
        //         return resp;
        //     })
        // );
    }

    datatableMember(dataTablesParameters: any) {
        const resp = {
            data: {
                data: [
                    { No: 1, total: 100, change: 100, amount: 200, action: 'เติมเงิน', date: '2025-01-01'},
                    { No: 2, total: 200, change: -50, amount: 150, action: 'ฝากซื้อสินค้า', date: '2025-01-01'},
                    { No: 3, total: 150, change: -50, amount: 100, action: 'ฝากชำระค่าสินค้า', date: '2025-01-01'},
                ],
                total: 10,
            }
        }

        return of(resp);

        // return this.http.post('/api/orders_page', dataTablesParameters).pipe(
        //     map((resp: any) => {
        //         return resp;
        //     })
        // );
    }

    get branches$() {
        return this._branch.asObservable();
    }
    create(data: any) {
        return this.http.post('/api/orders', data)
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

    paymentOrder(data: any) {
        return this.http.post(environment.apiUrl + '/api/payment_order', data)
    }
}
