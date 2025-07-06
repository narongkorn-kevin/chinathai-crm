import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private socket: Socket;
    private readonly SOCKET_URL = 'https://socket.dev-asha.com';

    constructor() {
        this.initializeSocketConnection();
    }
    private initializeSocketConnection(): void {
        if (!this.socket || !this.socket.connected) {
            this.socket = io(this.SOCKET_URL, {
                transports: ['websocket'],
                withCredentials: true,
                reconnection: true, // ✅ เปิดระบบ reconnect
                reconnectionAttempts: 5, // ✅ ลอง reconnect 5 ครั้ง
                reconnectionDelay: 3000, // ✅ รอ 3 วินาทีก่อนลองใหม่
            });

            this.socket.on('connect', () => {
                console.log('✅ Socket Connected:', this.socket.id);
            });

            this.socket.on('disconnect', (reason) => {
                console.warn('⚠️ Socket Disconnected:', reason);
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ Connection Error:', error);
            });
        }
    }

    // ✅ ฟัง Event และป้องกัน Memory Leak
    onEvent(eventName: string, callback: (data: any) => void): void {
        this.socket.off(eventName); // ลบ event เดิมก่อนสมัครใหม่
        this.socket.on(eventName, callback);
        console.log(`🎧 Listening for event: ${eventName}`);
    }

    // ✅ ส่งข้อมูลไปยังเซิร์ฟเวอร์
    emit(eventName: string, data: any): void {
        if (this.socket.connected) {
            this.socket.emit(eventName, data);
            console.log(`📤 Emitting event: ${eventName}`);
        } else {
            console.warn('⚠️ Cannot emit, socket is not connected.');
        }
    }

    // ✅ ปิดการเชื่อมต่ออย่างปลอดภัย
    disconnect(): void {
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
            console.log('🔌 Socket Disconnected');
        }
    }

    // ✅ ปิด socket เมื่อ Service ถูกทำลาย (OnDestroy)
    ngOnDestroy(): void {
        this.disconnect();
    }
}
