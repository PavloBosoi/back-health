import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ROUTES } from './routes.constants';

const routes: Routes = [
    {
        path: '',
        redirectTo: ROUTES.LOGIN,
        pathMatch: 'full'
    },
    {
        path: ROUTES.LOGIN, loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
        /*resolve: {recipes: RecipesResolver}*/
    },
    {
        path: ROUTES.COURSES, loadChildren: () => import('./pages/courses/courses.module').then(m => m.CoursesModule),
        /*resolve: {recipes: RecipesResolver}*/
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
