import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SelectImporterService {

    constructor(private http: HttpClient) { }

    getImporter() {
        return this.http.get(environment.apiUrl + '/api/get_register_importer')
    }
}
