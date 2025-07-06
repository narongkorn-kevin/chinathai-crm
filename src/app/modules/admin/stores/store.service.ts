import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }

    datatable(dataTablesParameters: any) {
        return this.http.post('/api/store_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/get_store/' + id,)
    }

    create(data: any) {
        return this.http.post(environment.apiUrl + '/api/store', data)
    }

    update(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_store', data)
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/api/store/' + id)
    }
    getall() {
        return this.http.get(environment.apiUrl + '/api/get_store').pipe(
            tap((resp: any) => {
                this._categories.next(resp);
            })
        );
    }
}
