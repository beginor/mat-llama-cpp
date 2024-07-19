import { Routes } from '@angular/router';

/* eslint-disable max-len */
const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent)
    }
];
/* eslint-enable max-len */

export default routes;
