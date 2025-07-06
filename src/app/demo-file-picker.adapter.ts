import {
    HttpRequest,
    HttpClient,
    HttpEvent,
    HttpEventType,
  } from '@angular/common/http';
  import { catchError, map } from 'rxjs/operators';
  import { Observable, of } from 'rxjs';
  import {
    FilePickerAdapter,
    UploadResponse,
    UploadStatus,
    FilePreviewModel,
  } from 'ngx-awesome-uploader';

  export class DemoFilePickerAdapter extends FilePickerAdapter {
    constructor(private http: HttpClient) {
      super();
    }
    public uploadFile(
      fileItem: FilePreviewModel
    ): Observable<UploadResponse | undefined> {
      const form = new FormData();
      form.append('file', fileItem.file);
      const api = '/api/upload/file';
      const req = new HttpRequest('POST', api, form, { reportProgress: true });
      return this.http.request(req).pipe(
        map((res: HttpEvent<any>) => {
          if (res.type === HttpEventType.Response) {
            const responseFromBackend = res.body;
            return {
              body: responseFromBackend,
              status: UploadStatus.UPLOADED,
            };
          } else if (res.type === HttpEventType.UploadProgress && res.total) {
            /** Compute and show the % done: */
            const uploadProgress = +Math.round((100 * res.loaded) / res.total);
            return {
              status: UploadStatus.IN_PROGRESS,
              progress: uploadProgress,
            };
          } else {
            return undefined;
          }
        }),
        catchError((er) => {
          console.log(er);
          return of({ status: UploadStatus.ERROR, body: er });
        })
      );
    }
    public removeFile(fileItem: FilePreviewModel): Observable<any> {
      const responseFromBackend = fileItem.uploadResponse;
      const removeApi =
        '/api/upload/' + responseFromBackend.id;
      return this.http.delete(removeApi);
    }
  }
