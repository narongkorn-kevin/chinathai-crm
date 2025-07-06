import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toUpper } from 'lodash';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _categories: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _branch: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  branches: any[] = [];
  selectedBranches: any[] = [];
  get categories$() {
    return this._categories.asObservable();
  }

  constructor(private http: HttpClient) { }
  datatable(dataTablesParameters: any) {
    return this.http.post('/api/user_page', dataTablesParameters).pipe(
        map((resp: any) => {
            return resp;
        })
    );
  }
  get branches$() {
    return this._branch.asObservable();
  }
  create(data: any) {
    return this.http.post('/api/user', data)
  }

  update(data: any) {
    return this.http.post('/api/update_user', data)
  }

  getRole() {
    return this.http.get('/api/role').pipe(
      tap((resp: any) => {
        this._roles.next(resp);
      }),
    )
  }

  getBranch() {
    return this.http.get('/api/branch').pipe(
      tap((resp: any) => {
        this._branch.next(resp);
        console.log(resp)
      })
    );
  }
  getPosition() {
    return this.http.get('/api/get_position').pipe(
      tap((resp: any) => {
        this._branch.next(resp);
      })
    );
  }
  getDepartment() {
    return this.http.get('/api/get_department').pipe(
      tap((resp: any) => {
        this._branch.next(resp);
      })
    );
  }

  delete(id: number) {
    return this.http.delete('/api/user/' + id)
  }


 

}
