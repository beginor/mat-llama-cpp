import { Routes } from '@angular/router';

/* eslint-disable max-len */
const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./code.component').then(m => m.CodeComponent)
    }
];
/* eslint-enable max-len */

export default routes;
