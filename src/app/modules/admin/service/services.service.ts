import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {

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

        return this.http.post('/api/services_page', dataTablesParameters).pipe(
            map((resp: any) => {
                // resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
                return resp;
            })
        );
    }

    get(id: number) {
        return this.http.get(environment.apiUrl + '/api/services/' + id,)
    }

    create(data: any) {
        return this.http.post(environment.apiUrl + '/api/services', data)
    }

    update(id: number, data: any) {
        return this.http.put(environment.apiUrl + '/api/services/' + id, data)
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/api/services/' + id)
    }

    upload(data: FormData) {
        return this.http.post(environment.apiUrl + '/api/upload_images', data)
    }
}
