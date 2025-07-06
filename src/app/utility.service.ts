import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UtilityService  {
    constructor() {}
    /**
     * เติม URL ตามค่า env
     */
    getFullUrl(path: string): string {
        return `${environment.apiUrl}/${path.replace(/^\/+/, '')}`;
    }
}
