import { Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { inject } from '@angular/core';
import { ChatService } from './chat.service';

export default [
    {
        path     : '',
        component: ChatComponent,
        resolve: {
            data: () => inject(ChatService).getall(),
        }
    },
] as Routes;
