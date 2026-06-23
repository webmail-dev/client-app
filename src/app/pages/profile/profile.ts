import { Component, OnDestroy, inject } from '@angular/core';
import { AppHeader } from '../../components/app-header/app-header';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { BodyClassService } from '../../services/body-class.service';

@Component({
  selector: 'app-profile-page',
  imports: [AppHeader, BottomNav],
  templateUrl: './profile.html',
})
export class ProfilePage implements OnDestroy {
  private readonly bodyClass = inject(BodyClassService);

  constructor() {
    this.bodyClass.setPageClass();
  }

  ngOnDestroy(): void {
    this.bodyClass.setPageClass();
  }
}
