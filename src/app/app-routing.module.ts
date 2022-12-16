import { Component, Injectable, NgModule } from '@angular/core';
import {
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
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
import { Title } from '@angular/platform-browser';

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Workshop - ${title}`);
    }
  }
}
const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        title: 'Main menu',
        component: DashboardComponent,
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            title: 'Products',
            component: ProductsComponent,
          },
          {
            path: 'edit/:id',
            title: 'Edit a product',
            component: EditingProductComponent,
          },
          {
            path: 'create-product',
            title: 'Creat a product',
            component: CreateProductComponent,
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: 'new',
            title: 'Creat a user',
            component: NewUserComponent,
          },
          {
            path: 'edit/:id',
            title: 'Edit a user',
            component: EditUserComponent,
          },
          {
            path: '',
            title: 'Users',
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
  providers: [
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy,
    },
  ],
})
export class AppRoutingModule {}
