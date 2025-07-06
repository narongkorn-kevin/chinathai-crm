import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { serialize } from 'object-to-formdata';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryManualService {

    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }


    datatable(dataTablesParameters: any) {
        return this.http.post('/api/category_manual_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

    getGetById(id: number) {
        return this.http.get(environment.apiUrl + '/api/category_manual/' + id,)
    }

    get() {
        return this.http.get(environment.apiUrl + '/api/get_category_manual',)
    }

    create(data: any) {
        return this.http.post(environment.apiUrl + '/api/category_manual', data)
    }

    update(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_category_manual', data)
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/api/category_manual/' + id)
    }

    categoryNews() {
        return this.http.get(environment.apiUrl + '/api/get_category_manual')
            .pipe(
                map((resp: { data: any[] }) => resp.data)
            )
    }
}
