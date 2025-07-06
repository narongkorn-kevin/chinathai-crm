import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { toUpper } from 'lodash';
import { serialize } from 'object-to-formdata';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    get categories$() {
        return this._categories.asObservable();
    }

    constructor(private http: HttpClient) { }

    //   datatable(dataTablesParameters: any) {
    //     const { columns, order, search, start, length } = dataTablesParameters;
    //     const page = start / length + 1;
    //     const column = columns[order[0].column].data;
    //     const dir = toUpper(order[0].dir);
    //     const sortBy = column + ':' + dir;

    //     return this.http.get('/api/device/datatables', {
    //       params: {
    //         page: page,
    //         limit: length,
    //         sortBy: sortBy,
    //         search: search.value,
    //       }
    //     }).pipe(
    //       map((resp: any) => {
    //         resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
    //         return resp;
    //       })
    //     );
    //   }

    datatable(dataTablesParameters: any) {
        // const { columns, order, search, start, length } = dataTablesParameters;
        // const page = start / length + 1;
        // const column = columns[order[0].column].data;
        // const dir = toUpper(order[0].dir);
        // const sortBy = column + ':' + dir;

        return this.http.post('/api/news_page', dataTablesParameters).pipe(
            map((resp: any) => {
                // resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
                return resp;
            })
        );
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/news/' + id,)
    }

    create(data: any) {
        return this.http.post(environment.apiUrl + '/api/news', data)
    }

    update(data: any) {
        return this.http.post(environment.apiUrl + '/api/update_news', data)
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/api/news/' + id)
    }

    categoryNews() {
        return this.http.get(environment.apiUrl + '/api/get_category_news')
            .pipe(
                map((resp: { data: any[] }) => resp.data)
            )
    }
}
