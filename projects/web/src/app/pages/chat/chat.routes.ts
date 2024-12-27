import { Routes } from '@angular/router';

/* eslint-disable @stylistic/max-len */
const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./chat.component').then(m => m.ChatComponent)
    }
];
/* eslint-enable @stylistic/max-len */

export default routes;
