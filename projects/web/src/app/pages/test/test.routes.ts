import { Routes } from '@angular/router';

/* eslint-disable max-len */
const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./test.component').then(m => m.TestComponent)
    }
];
/* eslint-enable max-len */

export default routes;
