import { Component, input } from '@angular/core';
import { ContentBanner } from '../../../models/content.models';

@Component({
  selector: 'app-home-banners',
  templateUrl: './home-banners.html',
})
export class HomeBanners {
  readonly banners = input<ContentBanner[]>([]);
}
