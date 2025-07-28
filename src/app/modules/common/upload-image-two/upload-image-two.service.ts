import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadImageTwoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  upload(data: FormData) {
    return this.http.post(environment.apiUrl + '/api/upload_images', data)
  }
}
