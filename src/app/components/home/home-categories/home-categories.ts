import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentCategory } from '../../../models/content.models';

@Component({
  selector: 'app-home-categories',
  imports: [RouterLink],
  templateUrl: './home-categories.html',
})
export class HomeCategories {
  readonly categories = input<ContentCategory[]>([]);
}
