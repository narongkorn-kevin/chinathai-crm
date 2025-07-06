import { profile } from './../../../mock-api/apps/chat/data';
import { data } from 'jquery';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { map, Subject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { SocketService } from "../../../socket.service";
import { FileDialogForm } from './file-dialog/dialog.component';


@Component({
    selector: 'app-chat-device',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        MatButtonModule,
        MatIconModule,
        FilePickerModule,
        MatMenuModule,
        MatDividerModule,
        MatButtonModule,
        FormsModule,
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ChatComponent implements OnInit, AfterViewInit {
    dtOptions: any = {};
    dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
    @ViewChild('btNg') btNg: any;
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    data: any = [];
    environment = environment.apiUrl;
    private socketSubscription: any;

    constructor(
        private _service: ChatService,
        private fuseConfirmationService: FuseConfirmationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private activated: ActivatedRoute,
        private socketService: SocketService,
        private _changeDetectorRef: ChangeDetectorRef,

    ) {
        this.data = this.activated.snapshot.data.data.data;
    }

    ngOnInit(): void {
        setTimeout(() => this.loadTable());
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.dtTrigger.next(this.dtOptions);
        }, 200);
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        if (this.socketSubscription) {
            this.socketSubscription.unsubscribe();
        }
        this.dtTrigger.unsubscribe();
    }

    loadTable(): void {
        this.dtOptions = {
            pagingType: 'full_numbers',
            serverSide: true, // Set the flag
            ajax: (dataTablesParameters: any, callback) => {
                this._service
                    .datatable(dataTablesParameters)
                    .pipe(map((resp: { data: any }) => resp.data))
                    .subscribe({
                        next: (resp: any) => {
                            callback({
                                recordsTotal: resp.total,
                                recordsFiltered: resp.total,
                                data: resp.data,
                            });
                        },
                    });
            },
            columns: [
                {
                    title: 'ลำดับ',
                    data: 'No',
                    className: 'w-15 text-center',
                },

                {
                    title: 'รหัสลูกค้า',
                    data: function (row: any) {
                        return row.member?.code;
                    },
                    className: 'text-center',
                },
                {
                    title: 'ชื่อลูกค้า',
                    data: function (row: any) {
                        return row.member?.fname + ' ' + row.member?.lname;
                    },
                    className: 'text-center',
                },
                {
                    title: 'จัดการ',
                    data: null,
                    defaultContent: '',
                    ngTemplateRef: {
                        ref: this.btNg,
                    },
                    className: 'w-15 text-center',
                },
            ],
        };
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
        });
    }

    opendialogfile() {
        const DialogRef = this.dialog.open(FileDialogForm, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            data: {
                type: 'file',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
    }

    openDialogimage(item: any) {
        const DialogRef = this.dialog.open(FileDialogForm, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            data: {
                type: 'image',
                value: item,
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rerender();
            }
        });
    }

    clickDelete(id: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'ยืนยันลบข้อมูล',
            message: 'กรุณาตรวจสอบข้อมูล หากลบข้อมูลแล้วจะไม่สามารถนำกลับมาได้',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: false,
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this._service.delete(id).subscribe({
                    error: (err) => {},
                    complete: () => {
                        this.toastr.success('ดำเนินการลบสำเร็จ');
                        this.rerender();
                    },
                });
            }
        });
    }

    selectedChat: any;
    profile: any;
    chatId: number;
    selectChat(chat: any) {
        this.chatId = chat.id;
        const chatId = chat.id;

        if (this.socketSubscription) {
            this.socketSubscription.unsubscribe();
        }

        this._service.get(chatId).subscribe({
            next: (resp: any) => {
                this.selectedChat = resp.data.chat_msgs;
                this.profile = resp.data.member;
                setTimeout(() => {
                    const container = this.chatContainer.nativeElement;
                    container.scrollTop = container.scrollHeight;
                }, 500);
            },
        });
        // this.profile = chat.member;
        // this.selectedChat = chat.chat_msgs;

        this.socketSubscription = this.socketService.onEvent(`teg-${chatId}`, (data) => {
            const stringData = data;
            const jsonData = JSON.parse(stringData);
            console.log('jsonData', jsonData);

            const form = {
                chat_id: jsonData.chat_id,
                message: jsonData.message,
                user_id: jsonData.messagePosition === 'admin' ? 0 : null,
                member_id: jsonData.messagePosition !== 'admin' ? 0 : null,
                type: jsonData.messageType,
            };
            this.selectedChat.push(form);
            this._changeDetectorRef.markForCheck();
            setTimeout(() => {
                const container = this.chatContainer.nativeElement;
                container.scrollTop = container.scrollHeight;
            }, 500);
        });

        setTimeout(() => {
            const container = this.chatContainer.nativeElement;
            container.scrollTop = container.scrollHeight;
        }, 500);
    }
    newMessage: string = '';

    sendChat() {
        if (this.newMessage.trim()) {
            const newChatMessage = {
                chat_id: this.chatId,
                message: this.newMessage,
                message_position: 'admin',
                type: 'text',
            };
            this._service.sendchat(newChatMessage).subscribe({
                next: (resp: any) => {
                    // this.selectedChat.push(resp.data);
                    setTimeout(() => {
                        const container = this.chatContainer.nativeElement;
                        container.scrollTop = container.scrollHeight;
                    }, 500);
                },
                error: (err) => {
                    console.log('err', err);
                    this.toastr.error('เกิดข้อผิดพลาดไม่สามารถส่งข้อความได้');
                },
            });
            this.newMessage = '';
        }
    }
    sendImage() {
        const DialogRef = this.dialog.open(FileDialogForm, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            data: {
                type: 'image',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('result',result);
                const newChatMessage = {
                    chat_id: this.chatId,
                    message: result.data,
                    message_position: 'admin',
                    type: 'image',
                };
                this._service.sendchat(newChatMessage).subscribe({
                    next: (resp: any) => {
                        setTimeout(() => {
                            const container = this.chatContainer.nativeElement;
                            container.scrollTop = container.scrollHeight;
                        }, 500);
                    },
                    error: (err) => {
                        this.toastr.error('เกิดข้อผิดพลาดไม่สามารถส่งรูปภาพได้');
                        console.log('err', err);
                    },
                });
            }
        });

    }
    sendFile() {
        const DialogRef = this.dialog.open(FileDialogForm, {
            disableClose: true,
            width: '500px',
            maxHeight: '90vh',
            data: {
                type: 'file',
            },
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('result',result);
                const newChatMessage = {
                    chat_id: this.chatId,
                    message: result.path,
                    message_position: 'admin',
                    type: 'file',
                };
                this._service.sendchat(newChatMessage).subscribe({
                    next: (resp: any) => {
                        setTimeout(() => {
                            const container = this.chatContainer.nativeElement;
                            container.scrollTop = container.scrollHeight;
                        }, 500);
                    },
                    error: (err) => {
                        this.toastr.error('เกิดข้อผิดพลาดไม่สามารถส่งไฟล์ได้');
                        console.log('err', err);
                    },
                });
            }
        });
    }

    formatDate(dateString: string): string {
        if (!dateString) return '';

        // แปลงรูปแบบจาก "14/02/2025 20:19:43" เป็น "2025-02-14T20:19:43"
        const parts = dateString.split(' ');
        if (parts.length !== 2) return '';

        const dateParts = parts[0].split('/');
        if (dateParts.length !== 3) return '';

        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1]}`;
        const date = new Date(formattedDate);

        return isNaN(date.getTime())
            ? ''
            : date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
              });
    }

    @ViewChild('chatContainer') private chatContainer: ElementRef;
    scrollToBottom(): void {
        try {
            setTimeout(() => {
                const container = this.chatContainer.nativeElement;
                container.scrollTop = container.scrollHeight;
            }, 500);
            // this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Scroll to bottom failed', err);
        }
    }



}
