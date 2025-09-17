import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FeeRateService {
    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) { }

    update(data: any) {
        return this.http.post('/api/fee_setting', data)
    }

    getFeeRate() {
        return this.http.get('/api/get_fee_setting').pipe(
            tap((resp: any) => {
                this._roles.next(resp);
            })
        );
    }

    datatable(dataTablesParameters: any) {
        return this.http
            .post('/api/fee_setting_page', dataTablesParameters)
            .pipe(
                map((resp: any) => {
                    return resp;
                })
            );
    }
}
