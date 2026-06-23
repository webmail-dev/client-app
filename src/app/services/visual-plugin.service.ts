import { Injectable, NgZone, inject } from '@angular/core';
import { ScriptLoaderService } from './script-loader.service';

declare global {
  interface Window {
    Swiper?: new (selector: string, options?: Record<string, unknown>) => unknown;
    initCustomSwipers?: () => void;
  }
}

@Injectable({ providedIn: 'root' })
export class VisualPluginService {
  private readonly scripts = inject(ScriptLoaderService);
  private readonly zone = inject(NgZone);
  private interactionsController?: AbortController;

  async initPagePlugins(usesSwiper = true): Promise<void> {
    this.initTemplateInteractions();

    if (!usesSwiper) {
      return;
    }

    await this.scripts.load('/assets/js/swiper-bundle.min.js');

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.initFallbackSwipers();
      });
    });
  }

  destroyPagePlugins(): void {
    this.interactionsController?.abort();
    this.interactionsController = undefined;
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

  private initFallbackSwipers(): void {
    if (!window.Swiper) {
      return;
    }

    const configs: Array<[string, Record<string, unknown>]> = [
      ['.banner1', { slidesPerView: 1, loop: true, pagination: { el: '.swiper-pagination' } }],
      ['.categories', { slidesPerView: 4.2, spaceBetween: 12 }],
      ['.products', { slidesPerView: 1.35, spaceBetween: 14 }],
      ['.brands-logo', { slidesPerView: 4.2, spaceBetween: 12 }],
      ['.main-seller-product', { slidesPerView: 1.3, spaceBetween: 14 }],
      ['.grocery-categories', { slidesPerView: 3.2, spaceBetween: 12 }],
      ['.pharmacy-categories', { slidesPerView: 4.2, spaceBetween: 12 }],
      ['.grocery-product', { slidesPerView: 1.65, spaceBetween: 14 }],
      ['.discount-banner', { slidesPerView: 1.2, spaceBetween: 14 }],
    ];

    for (const [selector, options] of configs) {
      if (document.querySelector(selector)) {
        new window.Swiper(selector, options);
      }
    }
  }
}
