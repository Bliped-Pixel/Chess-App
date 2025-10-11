import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'puzzles',
        loadComponent: () => import('./puzzles/puzzles').then(m => m.Puzzles)
    },
    {
        path: 'independents',
        loadComponent: () => import('./independents/independents').then(m => m.Independents)
    },
    {
        path: '',
        redirectTo: 'puzzles',
        pathMatch: 'full'
    }
];
