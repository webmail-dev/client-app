import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppHeader } from '../../components/app-header/app-header';
import { AppSidebar } from '../../components/app-sidebar/app-sidebar';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { FilterModal } from '../../components/filter-modal/filter-modal';
import { LocationModal } from '../../components/location-modal/location-modal';
import { SearchBar } from '../../components/search-bar/search-bar';
import { PharmacyContent } from '../../models/content.models';
import { BodyClassService } from '../../services/body-class.service';
import { ContentDataService } from '../../services/content-data.service';
import { VisualPluginService } from '../../services/visual-plugin.service';

@Component({
  selector: 'app-pharmacy-home-page',
  imports: [AppSidebar, AppHeader, SearchBar, BottomNav, FilterModal, LocationModal],
  templateUrl: './pharmacy-home.html',
})
export class PharmacyHomePage implements AfterViewInit, OnDestroy {
  private readonly bodyClass = inject(BodyClassService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly contentData = inject(ContentDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly visualPlugins = inject(VisualPluginService);
  content?: PharmacyContent;
  private viewReady = false;

  constructor() {
    this.bodyClass.setPageClass('pharmacy-color');
    this.contentData
      .getPharmacyContent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((content) => {
        this.content = content;
        this.renderDynamicUi();
      });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    void this.visualPlugins.initPagePlugins(false);
    this.renderDynamicUi();
  }

  ngOnDestroy(): void {
    this.visualPlugins.destroyPagePlugins();
    this.bodyClass.setPageClass();
  }

  private renderDynamicUi(): void {
    if (!this.viewReady || !this.content) {
      return;
    }

    this.cdr.detectChanges();
    void this.visualPlugins.initPagePlugins(true);
  }
}
