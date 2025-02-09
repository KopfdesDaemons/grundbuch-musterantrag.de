import { Routes } from "@angular/router";
import { AuthGuard } from "src/app/guards/auth.guard";

export const usersRoutes: Routes = [{
    path: '',
    loadComponent: () => import('./rooter/rooter.component').then(m => m.RooterComponent),
    children: [
        {
            path: '',
            loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent),
            canActivate: [AuthGuard]
        },
        {
            path: 'create-user',
            loadComponent: () => import('./create-user/create-user.component').then(m => m.CreateUserComponent),
            canActivate: [AuthGuard]
        },
        {
            path: 'user-roles',
            loadComponent: () => import('./user-roles/user-roles.component').then(m => m.UserRolesComponent),
            canActivate: [AuthGuard]
        },
    ]
}]