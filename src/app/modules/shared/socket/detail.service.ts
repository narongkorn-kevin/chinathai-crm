import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  constructor(private http: HttpClient,
    private socket: Socket
  ) {
    console.log('Socket Connected:', this.socket.ioSocket.connected);

    this.socket.ioSocket.on('connect', () => {
      console.log('Socket successfully connected');
    });

    this.socket.ioSocket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });
  }

  chatHistory(data: any) {
    return this.http.get(environment.apiUrl + '/api/message', {
      params: {
        refer_id: data
      }
    })
  }
  
  sendChat(data: any) {
    return this.http.post(environment.apiUrl + '/api/message', data, {
      params: {
        refer_id: data.refer_id,
        hospital_code: data.hospital_code
      }
    })
  }
  // ฟังข้อมูลจากเซิร์ฟเวอร์
  listen(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);
  }

}
