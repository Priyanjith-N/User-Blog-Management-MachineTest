import { Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/auth-page/auth-page.component';
import { LoginFormComponent } from './shared/components/login-form/login-form.component';
import { RegisterFormComponent } from './shared/components/register-form/register-form.component';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { CreateBlogFormComponent } from './shared/components/create-blog-form/create-blog-form.component';
import { AddEditBolgFormComponent } from './shared/components/add-edit-bolg-form/add-edit-bolg-form.component';

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
                path: "createblog",
                component: CreateBlogFormComponent
            },
            {
                path: "editblog/:blogId",
                component: AddEditBolgFormComponent
            }
        ]
    }
];