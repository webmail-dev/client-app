import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
})
export class AppHeader {
  readonly title = input('Entrega en tu zona');
  readonly showSidebar = input(true);
}
