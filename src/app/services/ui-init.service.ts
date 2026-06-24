import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';
import { ScriptLoaderService } from './script-loader.service';

interface SwiperInstance {
  destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
  update?: () => void;
  destroyed?: boolean;
}

interface SwiperElement extends HTMLElement {
  swiper?: SwiperInstance;
}

type SwiperConstructor = new (
  element: Element | string,
  options?: Record<string, unknown>,
) => SwiperInstance;

declare global {
  interface Window {
    Swiper?: SwiperConstructor;
  }
}

@Injectable({ providedIn: 'root' })
export class UiInitService {
  private readonly document = inject(DOCUMENT);
  private readonly scripts = inject(ScriptLoaderService);
  private readonly zone = inject(NgZone);
  private readonly swipers = new Map<Element, SwiperInstance>();
  private pendingFrame?: number;
  private reinitVersion = 0;

  private readonly swiperConfigs: Array<[string, Record<string, unknown>]> = [
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

  async reinitSwipers(root: ParentNode = this.document): Promise<void> {
    const version = ++this.reinitVersion;
    await this.scripts.load('/assets/js/swiper-bundle.min.js');
    await this.waitForRenderedDom();

    if (version !== this.reinitVersion) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.destroyDetachedSwipers();

      for (const [selector, options] of this.swiperConfigs) {
        root.querySelectorAll<SwiperElement>(selector).forEach((element) => {
          if (!this.hasRenderableSlides(element)) {
            this.destroySwiper(element);
            return;
          }

          this.destroySwiper(element);

          if (window.Swiper) {
            this.swipers.set(element, new window.Swiper(element, options));
          }
        });
      }
    });
  }

  destroySwipers(root: ParentNode = this.document): void {
    this.reinitVersion++;

    if (this.pendingFrame !== undefined) {
      cancelAnimationFrame(this.pendingFrame);
      this.pendingFrame = undefined;
    }

    for (const element of this.swipers.keys()) {
      if (root === this.document || root.contains(element)) {
        this.destroySwiper(element);
      }
    }
  }

  private waitForRenderedDom(): Promise<void> {
    return new Promise((resolve) => {
      this.zone.runOutsideAngular(() => {
        this.pendingFrame = requestAnimationFrame(() => {
          this.pendingFrame = requestAnimationFrame(() => {
            this.pendingFrame = undefined;
            resolve();
          });
        });
      });
    });
  }

  private hasRenderableSlides(element: Element): boolean {
    return element.querySelectorAll('.swiper-wrapper > .swiper-slide').length > 0;
  }

  private destroyDetachedSwipers(): void {
    for (const element of this.swipers.keys()) {
      if (!this.document.contains(element)) {
        this.destroySwiper(element);
      }
    }
  }

  private destroySwiper(element: Element): void {
    const swiperElement = element as SwiperElement;
    const instance = this.swipers.get(element) ?? swiperElement.swiper;

    if (instance && !instance.destroyed) {
      instance.destroy(true, true);
    }

    this.swipers.delete(element);
  }
}
