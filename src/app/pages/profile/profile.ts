import { ChangeDetectorRef, Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppHeader } from '../../components/app-header/app-header';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { ProfileContent } from '../../models/content.models';
import { BodyClassService } from '../../services/body-class.service';
import { ContentDataService } from '../../services/content-data.service';

@Component({
  selector: 'app-profile-page',
  imports: [AppHeader, BottomNav],
  templateUrl: './profile.html',
})
export class ProfilePage implements OnDestroy {
  private readonly bodyClass = inject(BodyClassService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly contentData = inject(ContentDataService);
  private readonly destroyRef = inject(DestroyRef);
  content?: ProfileContent;
  loadError = false;

  constructor() {
    this.bodyClass.setPageClass();
    this.contentData
      .getProfileContent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (content) => {
          this.content = content;
          this.loadError = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadError = true;
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.bodyClass.setPageClass();
  }
}
