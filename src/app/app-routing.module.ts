import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { WrapperComponent } from './wrapper/wrapper.component';
import { UsersComponent } from './users/users.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { NewuserComponent } from './newuser/newuser.component';

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
        component: ProductsComponent,
      },
      {
        path: 'users',
        children: [{
          path: 'new',
          component: NewuserComponent,
        },
        {
          path: '',
          component: UsersComponent,
        }
        ],
      },
      {
        path: 'create-product',
        component: CreateProductComponent,
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
