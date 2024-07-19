import { Routes } from '@angular/router';

/* eslint-disable max-len */
const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./chat.component').then(m => m.ChatComponent)
    }
];
/* eslint-enable max-len */

export default routes;
