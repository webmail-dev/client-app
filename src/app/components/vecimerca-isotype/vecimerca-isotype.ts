import { Component } from '@angular/core';

@Component({
  selector: 'app-vecimerca-isotype',
  template: `
    <svg class="vecimerca-isotype" viewBox="0 0 1041 1024" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path
          d="M204 46h633c28 0 54 13 72 35l94 124c24 31 36 68 36 107v23c0 57-47 104-104 104-50 0-92-36-102-84-13 47-56 82-107 82s-94-35-106-83c-13 48-56 83-107 83s-94-35-107-83c-12 48-55 83-106 83s-94-35-107-82c-10 48-52 84-102 84C49 439 2 392 2 335v-23c0-39 12-77 36-108l94-123c18-23 44-35 72-35Z"
        />
      </g>
      <g fill="none" stroke="currentColor" stroke-width="78" stroke-linecap="round" stroke-linejoin="round">
        <path d="M151 446c42 114 89 237 145 361 46 101 126 153 244 160" />
        <path d="M253 421c56 112 107 242 170 365 49 95 115 141 196 135" />
        <path d="M390 426l111 274c35 87 89 127 162 122" />
        <path d="M672 430 563 718c25 55 69 89 124 89 45 0 82-23 104-67l122-294" />
        <path d="M815 422 707 724c-43 119-102 200-181 242" />
      </g>
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 25px;
        height: 25px;
        line-height: 1;
      }

      .vecimerca-isotype {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class VecimercaIsotype {}
