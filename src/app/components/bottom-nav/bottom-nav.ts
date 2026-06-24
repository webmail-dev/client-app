import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

type NavKey = 'home' | 'food' | 'grocery' | 'pharmacy' | 'profile';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink],
  templateUrl: './bottom-nav.html',
})
export class BottomNav {
  readonly active = input<NavKey>('home');
  readonly logo = input('food-logo');
  readonly brand = input('Dale Pues');
}
