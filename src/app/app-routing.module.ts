import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ROUTES } from './routes.constants';

const routes: Routes = [
    {
        path: '',
        redirectTo: ROUTES.COURSES,
        pathMatch: 'full'
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
