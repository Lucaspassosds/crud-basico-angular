import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './components/create.component';
import { CursosComponent } from './components/cursos.component';
import { IndexComponent } from './components/index.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'add', component: CreateComponent },
  { path: 'add/:id', component: CreateComponent },
  { path: 'courses', component: CursosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
