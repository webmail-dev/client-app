import { Injectable, NgZone, inject } from '@angular/core';
import { UiInitService } from './ui-init.service';

@Injectable({ providedIn: 'root' })
export class VisualPluginService {
  private readonly uiInit = inject(UiInitService);
  private readonly zone = inject(NgZone);
  private interactionsController?: AbortController;

  async initPagePlugins(usesSwiper = true): Promise<void> {
    this.initTemplateInteractions();

    if (!usesSwiper) {
      return;
    }

    await this.uiInit.reinitSwipers();
  }

  destroyPagePlugins(): void {
    this.interactionsController?.abort();
    this.interactionsController = undefined;
    this.uiInit.destroySwipers();
  }

  private initTemplateInteractions(): void {
    this.interactionsController?.abort();
    this.interactionsController = new AbortController();
    const { signal } = this.interactionsController;

    this.zone.runOutsideAngular(() => {
      document.querySelector<HTMLInputElement>('#dir-switch')?.addEventListener(
        'change',
        (event) => {
          const checked = (event.target as HTMLInputElement).checked;
          document.documentElement.setAttribute('dir', checked ? 'rtl' : 'ltr');
          localStorage.setItem('dir', checked ? 'rtl' : 'ltr');
        },
        { signal },
      );

      document.querySelector<HTMLInputElement>('#dark-switch')?.addEventListener(
        'change',
        (event) => {
          const checked = (event.target as HTMLInputElement).checked;
          document.body.classList.toggle('dark', checked);
          if (checked) {
            localStorage.setItem('layout_version', 'dark');
          } else {
            localStorage.removeItem('layout_version');
          }
        },
        { signal },
      );

      document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((input) => {
        input.addEventListener(
          'input',
          () => {
            const min = Number(input.min || 0);
            const max = Number(input.max || 100);
            const value = Number(input.value || 0);
            input.style.backgroundSize = `${((value - min) * 100) / (max - min)}% 100%`;
          },
          { signal },
        );
      });

      document.querySelectorAll<HTMLElement>('.like-icon').forEach((icon) => {
        icon.addEventListener(
          'click',
          () => {
            icon.classList.toggle('animate');
            icon.classList.toggle('active');
            icon.classList.toggle('inactive');
          },
          { signal },
        );
      });
    });
  }
}
