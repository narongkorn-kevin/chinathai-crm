import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  constructor(private http: HttpClient) { }

  datatable(dataTablesParameters: any) {
    const { columns, order, search, start, length } = dataTablesParameters;
    const page = start / length + 1;
    const column = columns[order[0].column].data;
    const dir = toUpper(order[0].dir);
    const sortBy = column + ':' + dir;

    return this.http.get('/api/shift/datatables', {
      params: {
        page: page,
        limit: length,
        sortBy: sortBy,
        search: search.value,
      }
    }).pipe(
      map((resp: any) => {
        resp.data.forEach((e: any, i: number) => e.no = start + i + 1);
        return resp;
      })
    );
  }

  create(data: any) {
    return this.http.post('/api/shift', data)
  }

  update(id: any,data: any) {
    return this.http.put('/api/shift/' + id, data)
  }

  get(id: any) {
    return this.http.get('/api/shift/' + id)
  }

  delete(id: number) {
    return this.http.delete('/api/shift/' + id)
  }
}
