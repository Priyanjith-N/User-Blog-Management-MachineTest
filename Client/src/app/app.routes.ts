import { Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/auth-page/auth-page.component';
import { LoginFormComponent } from './shared/components/login-form/login-form.component';

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
            }
        ]
    }
];