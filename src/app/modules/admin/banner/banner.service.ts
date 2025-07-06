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
    const { columns, order, search, start, length, filter } = dataTablesParameters;
    const page = start / length + 1;
    const column = columns[order[0].column].data;
    const dir = toUpper(order[0].dir);
    const sortBy = column + ':' + dir;

    return this.http.get('/api/banner/datatables', {
      params: {
        page: page,
        limit: length,
        sortBy: sortBy,
        search: search.value,
        ...removeEmpty(filter)
      }
    }).pipe(
      map((resp: any) => {
        resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
        return resp;
      })
    );
  }

  create(data: any) {
    return this.http.post('/api/banner', data)
  }

  update(id: any,data: any) {
    return this.http.put('/api/banner/' + id, data)
  }

  get(id:string) {
    return this.http.get('/api/banner/'+ id)
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
