import { Component, input } from '@angular/core';
import { ContentOfferStrip } from '../../../models/content.models';

@Component({
  selector: 'app-home-offer-strip',
  templateUrl: './home-offer-strip.html',
})
export class HomeOfferStrip {
  readonly offerStrip = input<ContentOfferStrip | null>(null);
}
