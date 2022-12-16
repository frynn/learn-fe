import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { WrapperComponent } from './wrapper/wrapper.component';
import { UsersComponent } from './users/users.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { NotAuthGuard } from './shared/guards/not-auth.guard';
import { EditingProductComponent } from './products/editing-product/editing-product.component';

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        title: 'Workshop - Main menu',
        component: DashboardComponent,
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            title: 'Workshop - Products',
            component: ProductsComponent,
          },
          {
            path: 'edit/:id',
            title: 'Workshop - Edit a product',
            component: EditingProductComponent,
          },
          {
            path: 'create-product',
            title: 'Workshop - Creat a product',
            component: CreateProductComponent,
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: 'new',
            title: 'Workshop - Creat a user',
            component: NewUserComponent,
          },
          {
            path: 'edit/:id',
            title: 'Workshop - Edit a user',
            component: EditUserComponent,
          },
          {
            path: '',
            title: 'Workshop - Users',
            component: UsersComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
