import { Routes } from '@angular/router';

// components
import { AuthPageComponent } from './features/auth/auth-page/auth-page.component';
import { LoginFormComponent } from './shared/components/login-form/login-form.component';
import { RegisterFormComponent } from './shared/components/register-form/register-form.component';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { AddEditBolgFormComponent } from './shared/components/add-edit-bolg-form/add-edit-bolg-form.component';
import { LandingComponent } from './shared/components/landing/landing.component';
import { MyBlogsComponent } from './shared/components/my-blogs/my-blogs.component';
import { BlogDetailComponent } from './shared/components/blog-detail/blog-detail.component';
import { NotFoundPageComponent } from './features/notFound/not-found-page/not-found-page.component';

// guards
import { authGuard } from './core/guards/auth.guard';
import { canAcessAuthPageGuard } from './core/guards/can-acess-auth-page.guard';

export const routes: Routes = [
    {
        path: "auth",
        redirectTo: "auth/login",
        pathMatch: "full"
    },
    {
        path: "auth",
        component: AuthPageComponent,
        canActivate: [canAcessAuthPageGuard],
        children: [
            {
                path: "login",
                canActivate: [canAcessAuthPageGuard],
                component: LoginFormComponent
            },
            {
                path: "register",
                canActivate: [canAcessAuthPageGuard],
                component: RegisterFormComponent
            }
        ]
    },
    {
        path: "",
        component: HomePageComponent,
        canActivate: [authGuard],
        children: [
            {
                path: "",
                canActivate: [authGuard],
                component: LandingComponent
            },
            {
                path: "myblogs",
                canActivate: [authGuard],
                component: MyBlogsComponent
            },
            {
                path: "createblog",
                canActivate: [authGuard],
                component: AddEditBolgFormComponent
            },
            {
                path: "editblog/:blogId",
                canActivate: [authGuard],
                component: AddEditBolgFormComponent
            },
            {
                path: "blog/:blogId",
                canActivate: [authGuard],
                component: BlogDetailComponent
            }
        ]
    },
    {
        path: "**",
        component: NotFoundPageComponent
    }
];