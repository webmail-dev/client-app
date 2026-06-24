import { Component, input } from '@angular/core';
import { ContentProduct } from '../../../models/content.models';

@Component({
  selector: 'app-home-featured-products',
  templateUrl: './home-featured-products.html',
})
export class HomeFeaturedProducts {
  readonly products = input<ContentProduct[]>([]);
}
