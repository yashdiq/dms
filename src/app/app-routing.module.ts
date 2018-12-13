import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeRepositoryComponent } from './pages/home-repository/home-repository.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'home-repository',
    component: HomeRepositoryComponent
  },
  {
    path: 'home-repository/:id',
    component: HomeRepositoryComponent
  },
  {
    path: '',
    redirectTo: '/home-repository',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    enableTracing: true // <-- this is for development only
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
