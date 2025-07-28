import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ArticleService {

    constructor(private http: HttpClient) { }

    import(data: FormData) {
        return this.http.post('/api/member/import-excel', data);
    }
    export(data: any) {
        return this.http.post(`/api/member/export/excel`, data, {
            responseType: 'blob',
        });
    }

    createCredit(data: any, id: any) {
        return this.http.post('/api/member/' + id + '/topup', data);
    }
    //=========================================================================================================
    datatable(dataTablesParameters: any) {
        // const resp = {
        //     data: {
        //         data: [
        //             { No: 1, category: 'ทั่วไป', name: 'หัวข้อบทความ', status: true,  code: 'TAO', nameTh: 'Taobao', nameCn: 'Taobao', nameEn: 'Taobao', url: 'https://google.co.th', image: 'https://placehold.co/600x400' },
        //             { No: 2, category: 'ทั่วไป', name: 'หัวข้อบทความ', status: true,  code: 'TAO', nameTh: 'Taobao', nameCn: 'Taobao', nameEn: 'Taobao', url: 'https://google.co.th', image: 'https://placehold.co/600x400' },
        //             { No: 3, category: 'ทั่วไป', name: 'หัวข้อบทความ', status: false,  code: 'TAO', nameTh: 'Taobao', nameCn: 'Taobao', nameEn: 'Taobao', url: 'https://google.co.th', image: 'https://placehold.co/600x400' },
        //         ],
        //         total: 10,
        //     }
        // }

        // return of(resp);


        return this.http.post('/api/news_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
    datatabletype(dataTablesParameters: any) {
        return this.http.post('/api/category_news_page', dataTablesParameters).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }
    get(id: number) {
        return this.http.get(
            environment.apiUrl + '/api/news/' + id
        );
    }
    update(data: any) {
        return this.http.post('/api/update_news', data)
    }

    create(data: any) {
        return this.http.post(
            environment.apiUrl + '/api/news',
            data
        );
    }

    delete(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/news/' + id
        );
    }

    gettype(id: number) {
        return this.http.get(
            environment.apiUrl + '/api/category_news/' + id
        );
    }

    updatetype(data: any) {
        return this.http.post('/api/update_category_news', data)
    }

    createtype(data: any) {
        return this.http.post(
            environment.apiUrl + '/api/category_news',
            data
        );
    }

    deletetype(id: number) {
        return this.http.delete(
            environment.apiUrl + '/api/category_news/' + id
        );
    }

    getAgent() {
        return this.http.get(
            environment.apiUrl + '/api/get_agent'
        );
    }
    getCategoryNews() {
        return this.http.get(
            environment.apiUrl + '/api/get_category_news'
        );
    }
    getThaiTransport() {
        return this.http.get(
            environment.apiUrl + '/api/get_transport'
        );
    }
}
