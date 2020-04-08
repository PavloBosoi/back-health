import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesComponent } from './courses.component';

const routes: Routes = [
    {
        path: '',
        component: CoursesComponent
    },
/*{
    path: ':id',
    component: RecipeDetailsComponent,
    resolve: {recipes: RecipesResolver}
    }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
