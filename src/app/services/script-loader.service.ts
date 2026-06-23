import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private readonly document = inject(DOCUMENT);
  private readonly loadedScripts = new Map<string, Promise<Event>>();

  load(src: string): Promise<Event> {
    const existing = this.loadedScripts.get(src);

    if (existing) {
      return existing;
    }

    const promise = new Promise<Event>((resolve, reject) => {
      const current = this.document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

      if (current) {
        resolve(new Event('load'));
        return;
      }

      const script = this.document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      this.document.body.appendChild(script);
    });

    this.loadedScripts.set(src, promise);
    return promise;
  }

  loadAll(scripts: string[]): Promise<Event[]> {
    return scripts.reduce(
      (chain, script) => chain.then((events) => this.load(script).then((event) => [...events, event])),
      Promise.resolve([] as Event[]),
    );
  }
}
