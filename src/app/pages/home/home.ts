import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppHeader } from '../../components/app-header/app-header';
import { AppSidebar } from '../../components/app-sidebar/app-sidebar';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { FilterModal } from '../../components/filter-modal/filter-modal';
import { LocationModal } from '../../components/location-modal/location-modal';
import { SearchBar } from '../../components/search-bar/search-bar';
import { BodyClassService } from '../../services/body-class.service';
import { VisualPluginService } from '../../services/visual-plugin.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, AppSidebar, AppHeader, SearchBar, BottomNav, FilterModal, LocationModal],
  templateUrl: './home.html',
})
export class HomePage implements AfterViewInit, OnDestroy {
  private readonly bodyClass = inject(BodyClassService);
  private readonly visualPlugins = inject(VisualPluginService);

  constructor() {
    this.bodyClass.setPageClass(undefined);
  }

  ngAfterViewInit(): void {
    void this.visualPlugins.initPagePlugins(true);
  }

  ngOnDestroy(): void {
    this.visualPlugins.destroyPagePlugins();
    this.bodyClass.setPageClass();
  }
}
