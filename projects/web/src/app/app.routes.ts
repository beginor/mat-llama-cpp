import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'chat/:prompt',
        loadChildren: () => import('./pages/chat/chat.routes'),
    },
    {
        path: 'code/:prompt',
        loadChildren: () => import('./pages/code/code.routes'),
    },
    {
        path: 'test',
        loadChildren: () => import('./pages/test/test.routes'),
    },
    {
        path: '**',
        loadChildren: () => import('./pages/not-found/not-found.routes'),
    }
];
