import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClaimOrderService {


    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    branches: any[] = [];
    selectedBranches: any[] = [];
    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }
    datatable(dataTablesParameters: any) {
        return this.http.post('/api/import_product_order_page', dataTablesParameters).pipe(
            map((resp: any) => {
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

    update(data: any) {
        return this.http.post('/api/update_user', data)
    }

    delete(id: number) {
        return this.http.delete('/api/orders/' + id)
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/import_product_order/' + id)
    }

    getMember() {
        return this.http.get(environment.apiUrl + '/api/get_member')
    }

    getMemberById(id: number) {
        return this.http.get(environment.apiUrl + '/api/member/' + id)
    }

    getAddOnService() {
        return this.http.get(environment.apiUrl + '/api/get_add_on_services')
    }

    updateStatus(data: { status: string, orders: number[] }) {
        return this.http.post(environment.apiUrl + '/api/update_status_import_product_order', data)
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

    createImportProductOrder(data: any) {
        return this.http.post(environment.apiUrl + '/api/import_product_order', data)
    }

    updateFeeAmount(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_fee_amount', data)
    }

    //taobao
    upload(data: FormData) {
        return this.http.post(environment.apiUrl + '/api/upload_images', data)
    }

    paymentOrder(data: any) {
        return this.http.post(environment.apiUrl + '/api/payment_order', data)
    }

    getCategoryFee() {
        return this.http.get(environment.apiUrl + '/api/get_category_fee/DocumentImport')
    }

    getStore() {
        return this.http.get(environment.apiUrl + '/api/get_store')
    }

    getImportPo(id: number) {
        return this.http.get(environment.apiUrl + '/api/get_import_po/' + id)
    }

    getDeliveryAllOrdersByMember(memberId: number) {
        return this.http.get(environment.apiUrl + '/api/get_delivery_all_orders_by_member/' + memberId)
    }

    updateFileImportProductOrder(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_file_import_product_order', data)
    }
}
