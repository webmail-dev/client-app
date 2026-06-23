import { Component, input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
})
export class SearchBar {
  readonly placeholder = input('Restaurant, item & more');
}
