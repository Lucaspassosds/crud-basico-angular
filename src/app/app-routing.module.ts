import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './components/create.component';
import { IndexComponent } from './components/index.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'add', component: CreateComponent },
  { path: 'add/:id', component: CreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
