import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { profileCompletionGuard } from './guards/profile-completion.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
    title: 'Iniciar sesión',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterPage),
    title: 'Crear cuenta',
  },
  {
    path: 'complete-profile',
    canActivate: [profileCompletionGuard],
    loadComponent: () =>
      import('./pages/complete-profile/complete-profile').then((m) => m.CompleteProfilePage),
    title: 'Completar perfil',
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'Dale Pues',
  },
  {
    path: 'food',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/food-home/food-home').then((m) => m.FoodHomePage),
    title: 'Comida',
  },
  {
    path: 'grocery',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/grocery-home/grocery-home').then((m) => m.GroceryHomePage),
    title: 'Mercado',
  },
  {
    path: 'pharmacy',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/pharmacy-home/pharmacy-home').then((m) => m.PharmacyHomePage),
    title: 'Farmacia',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfilePage),
    title: 'Perfil',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
