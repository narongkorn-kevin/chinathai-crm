import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { removeEmpty } from 'app/modules/common/helper';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private _banner: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    return this.http
      .post('/api/banner_page', dataTablesParameters)
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  create(data: any) {
    return this.http.post('/api/banner', data)
  }

  update(id: any, data: any) {
    return this.http.put('/api/banner/' + id, data)
  }

  get(id: string) {
    return this.http.get('/api/banner/' + id)
  }

  // get(id:string) {
  //   return this.http.get(environment.apiUrl + 'api/banner/'+ id).pipe(
  //     tap((resp: any) => {
  //       this._banner.next(resp);
  //     }),
  //   )
  // }

  delete(id: number) {
    return this.http.delete('/api/banner/' + id)
  }
}
