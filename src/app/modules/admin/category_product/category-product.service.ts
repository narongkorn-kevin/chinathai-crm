import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryProductService {

    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }

    datatable(dataTablesParameters: any) {
        return this.http.post('/api/category_product_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/category_product/' + id,)
    }

    create(data: any) {
        return this.http.post(environment.apiUrl + '/api/category_product', data)
    }

    update(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_category_product', data)
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/api/category_product/' + id)
    }
}
