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

export const routes: Routes = [
    {
        path: "auth",
        redirectTo: "auth/login",
        pathMatch: "full"
    },
    {
        path: "auth",
        component: AuthPageComponent,
        children: [
            {
                path: "login",
                component: LoginFormComponent
            },
            {
                path: "register",
                component: RegisterFormComponent
            }
        ]
    },
    {
        path: "",
        component: HomePageComponent,
        children: [
            {
                path: "",
                component: LandingComponent
            },
            {
                path: "myblogs",
                component: MyBlogsComponent
            },
            {
                path: "createblog",
                component: AddEditBolgFormComponent
            },
            {
                path: "editblog/:blogId",
                component: AddEditBolgFormComponent
            },
            {
                path: "blog/:blogId",
                component: BlogDetailComponent
            }
        ]
    }
];