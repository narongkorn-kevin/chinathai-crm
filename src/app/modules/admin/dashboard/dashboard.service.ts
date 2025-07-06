import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _dashboardData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _branchNames: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);

  constructor(private http: HttpClient) {}

  getBranchNames(): Observable<string[]> {
    return this.http.get<any[]>('/api/branch').pipe(
      tap(data => this._branchNames.next(data.map(item => item.name))),
      map(data => data.map(item => item.name))
    );
  }

  getDashboard(): Observable<any> {
    const branchId = localStorage.getItem('branch');
    return this.http.get<any>('/api/dashboard', { params: { branchId } }).pipe(
      tap(data => this._dashboardData.next(data)),
      map(data => data)
    );
  }
}
