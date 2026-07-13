import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppHeader } from '../../components/app-header/app-header';
import { AppSidebar } from '../../components/app-sidebar/app-sidebar';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { FilterModal } from '../../components/filter-modal/filter-modal';
import { HomeBanners } from '../../components/home/home-banners/home-banners';
import { HomeCategories } from '../../components/home/home-categories/home-categories';
import { HomeFeaturedProducts } from '../../components/home/home-featured-products/home-featured-products';
import { HomeOfferStrip } from '../../components/home/home-offer-strip/home-offer-strip';
import { LocationModal } from '../../components/location-modal/location-modal';
import { SearchBar } from '../../components/search-bar/search-bar';
import { HomeContent } from '../../models/content.models';
import { BodyClassService } from '../../services/body-class.service';
import { ContentDataService } from '../../services/content-data.service';
import { VisualPluginService } from '../../services/visual-plugin.service';

@Component({
  selector: 'app-home-page',
  imports: [
    AppSidebar,
    AppHeader,
    SearchBar,
    HomeCategories,
    HomeOfferStrip,
    HomeBanners,
    HomeFeaturedProducts,
    BottomNav,
    FilterModal,
    LocationModal,
  ],
  templateUrl: './home.html',
})
export class HomePage implements AfterViewInit, OnDestroy {
  private readonly bodyClass = inject(BodyClassService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly contentData = inject(ContentDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly visualPlugins = inject(VisualPluginService);
  content?: HomeContent;
  private viewReady = false;

  constructor() {
    this.bodyClass.setPageClass(undefined);
    this.contentData
      .getHomeContent()
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
