import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'Dale Pues',
  },
  {
    path: 'food',
    loadComponent: () => import('./pages/food-home/food-home').then((m) => m.FoodHomePage),
    title: 'Food',
  },
  {
    path: 'grocery',
    loadComponent: () => import('./pages/grocery-home/grocery-home').then((m) => m.GroceryHomePage),
    title: 'Grocery',
  },
  {
    path: 'pharmacy',
    loadComponent: () =>
      import('./pages/pharmacy-home/pharmacy-home').then((m) => m.PharmacyHomePage),
    title: 'Pharmacy',
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfilePage),
    title: 'Profile',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
