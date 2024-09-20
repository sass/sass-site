import {SplitView} from '@spectrum-web-components/split-view';
import '@spectrum-web-components/split-view/sp-split-view.js';

export default function setup(): void {
  const mql = window.matchMedia('(max-width: 60em');
  mql.addEventListener('change', event => {
    const topSplit = document.querySelector('.sl-c-playground') as SplitView;
    if (topSplit) topSplit.vertical = event.matches;
  });
}
