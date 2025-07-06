import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  upload(file: File) {
    const form = new FormData();

    form.append('file', file);

    return this.http.post('/api/upload/file', form)
  }

  get(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'blob' })
  }

  getToFile(url: string): Observable<File> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((resp: any) => {
        return new File([resp], 'image', { type: resp.type});
      })
    )
  }
}
