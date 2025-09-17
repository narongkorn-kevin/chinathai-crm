import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BannersService {

    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }

    datatable(dataTablesParameters: any) {
        return this.http.post('/api/banner_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/banner/' + id,)
    }

    create(data: any) {
        return this.http.post(environment.apiUrl + '/api/banner', data)
    }

    update(data: any) {
        return this.http.put(environment.apiUrl + '/api/banner/' + data.id, data)
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/api/banner/' + id)
    }
    getall() {
        return this.http.get(environment.apiUrl + '/api/get_banner').pipe(
            tap((resp: any) => {
                this._categories.next(resp);
            })
        );
    }
}
