import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/router.component').then(m => m.RouterComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'create-user',
        loadComponent: () => import('./create-user/create-user.component').then(m => m.CreateUserComponent)
      },
      {
        path: 'user-roles',
        loadComponent: () => import('./user-roles/user-roles.component').then(m => m.UserRolesComponent)
      }
    ]
  }
];
