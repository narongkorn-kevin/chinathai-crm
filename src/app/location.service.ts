import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private http: HttpClient) { }

    getProvinces(): Observable<any> {
        return this.http.get('../assets/data_thai/provinces.json');
    }

    getDistricts(provinceCode?: string): Observable<any> {
        return this.http.get<any[]>('../assets/data_thai/districts.json').pipe(
            map(districts => provinceCode ? districts.filter(d => d.provinceCode === provinceCode) : districts)
        );
    }

    getSubdistricts(districtCode?: string): Observable<any> {
        return this.http.get<any[]>('../assets/data_thai/subdistricts.json').pipe(
            map(subdistricts => districtCode ? subdistricts.filter(s => s.districtCode === districtCode) : subdistricts)
        );
    }

    getPostalCode(subdistrictCode?: string): Observable<string> {
        return this.http.get<any[]>('../assets/data_thai/subdistricts.json').pipe(
            map(subdistricts => {
                if (!subdistrictCode) return ''; // ถ้าไม่มีค่าก็คืนค่าว่าง
                const subdistrict = subdistricts.find(s => s.subdistrictCode === subdistrictCode);
                return subdistrict ? subdistrict.postalCode : '';
            })
        );
    }
}
