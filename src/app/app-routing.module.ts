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
import { EditingProductComponent } from './products/editing-product/editing-product.component';

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            component: ProductsComponent,
          },
          {
            path: 'edit/:id',
            component: EditingProductComponent,
          },
          {
            path: 'create-product',
            component: CreateProductComponent,
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: 'new',
            component: NewUserComponent,
          },
          {
            path: 'edit/:id',
            component: EditUserComponent,
          },
          {
            path: '',
            component: UsersComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
