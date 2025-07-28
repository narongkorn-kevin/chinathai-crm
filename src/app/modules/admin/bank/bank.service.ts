import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BankService {

    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }

    datatable(dataTablesParameters: any) {

        return this.http.post('/api/bank_page', dataTablesParameters).pipe(
            map((resp: any) => {
                // resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
                return resp;
            })
        );
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/bank/' + id,)
    }

    create(data: any) {
        return this.http.post(environment.apiUrl + '/api/bank', data)
    }

    update(data: any) {
        return this.http.put(environment.apiUrl + '/api/bank/' + data.id, data)
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/api/bank/' + id)
    }
    upload_image(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_images', data)
    }
    upload_file(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_file', data)
    }
}
