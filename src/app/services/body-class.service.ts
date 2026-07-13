import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BodyClassService {
  private readonly document = inject(DOCUMENT);
  private readonly renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);
  private readonly managedClasses = ['grocery-color', 'pharmacy-color'];

  setPageClass(className?: string): void {
    for (const managedClass of this.managedClasses) {
      this.renderer.removeClass(this.document.body, managedClass);
    }

    if (className) {
      this.renderer.addClass(this.document.body, className);
    }
  }
}
