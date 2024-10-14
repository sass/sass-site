import {SplitView} from '@spectrum-web-components/split-view';
import '@spectrum-web-components/split-view/sp-split-view.js';

/**
 * Make split views responsive and stack vertically on narrow screens.
 */
export default function setUpSplitView(): void {
  // 60em = --sl-breakpoint--large
  const mql = window.matchMedia('(max-width: 60em');
  const topSplit = document.querySelector('.sl-c-playground') as SplitView;

  function updateLayout(event: MediaQueryListEvent | MediaQueryList): void {
    if (topSplit) topSplit.vertical = event.matches;
  }
  updateLayout(mql);
  mql.addEventListener('change', updateLayout);
}
