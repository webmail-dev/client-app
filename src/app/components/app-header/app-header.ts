import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
})
export class AppHeader {
  readonly title = input('Ontario, Canada');
  readonly showSidebar = input(true);
}
