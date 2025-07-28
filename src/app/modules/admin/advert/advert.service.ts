import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {

    constructor(private readonly http: HttpClient) { }

    datatable(dataTablesParameters: any) {
        // const resp = {
        //     data: {
        //         data: [
        //             { No: 1, nameTh: 'Taobao', nameCn: 'Taobao', nameEn: 'Taobao', url: 'https://google.co.th', image: 'https://placehold.co/600x400' }
        //         ],
        //         total: 10,
        //     }
        // }

        // return of(resp);


        return this.http.post('/api/ads_page', dataTablesParameters).pipe(
                        map((resp: any) => {
                            return resp;
                        })
                    );
    }
    get(id: number) {
        return this.http.get(
            environment.apiUrl + '/api/ads/' + id
        );
    }

    create(data: any) {
        return this.http.post(
            environment.apiUrl + '/api/ads',
            data
        );
    }
    update(data: any,id: number) {
        return this.http.put('/api/ads/'+ id, data)
    }

    delete(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/ads/' + id
        );
    }
    getAds() {
        return this.http.get('/api/get_ads')
    }

    upload_image(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_images', data)
    }
    upload_file(data: any) {
        return this.http.post(environment.apiUrl + '/api/upload_file', data)
    }
}
