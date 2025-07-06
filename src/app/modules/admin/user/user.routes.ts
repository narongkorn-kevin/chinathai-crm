import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export default [
    {
        path     : '',
        component: UserComponent,
        resolve: {
            department: () => inject(UserService).getDepartment(),
            position: () => inject(UserService).getPosition(),
        }
    },
] as Routes;
