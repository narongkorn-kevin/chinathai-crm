import { Routes } from '@angular/router';
import { PanelComponent } from './page.component';
import { PanelFormComponent } from './form/form.component';

export default [
    {
        path     : '',
        component: PanelComponent,

    },
    {
        path    : 'form',
        component: PanelFormComponent
    }

] as Routes;
