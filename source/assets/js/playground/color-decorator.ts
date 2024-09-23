import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import {Range} from '@codemirror/state';
import {syntaxTree} from '@codemirror/language';
import Color from 'colorjs.io';

// The node types that may contain a color.
const COLOR_NODE_TYPES = ['CallExpression', 'ColorLiteral', 'ValueName'];

// The CallExpression types that may contain a color.
const COLOR_FUNCTIONS = [
  'oklch',
  'oklab',
  'rgb',
  'rgba',
  'color',
  'hsl',
  'hsla',
  'lab',
  'lch',
];

function colorPhrases(view: EditorView): DecorationSet {
  const widgets: Range<Decoration>[] = [];
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: node => {
        if (COLOR_NODE_TYPES.includes(node.name)) {
          const colorString = view.state.doc.sliceString(node.from, node.to);
          if (
            node.name === 'CallExpression' &&
            !COLOR_FUNCTIONS.some(func => colorString.split('(')[0] === func)
          ) {
            return;
          }
          const deco = Decoration.widget({
            widget: new ColorWidget(colorString),
            side: 1,
          });
          widgets.push(deco.range(node.to));
        }
      },
    });
  }
  return Decoration.set(widgets, true);
}

class ColorWidget extends WidgetType {
  colorObj: Color | undefined;
  inP3: boolean | undefined;
  isValid: boolean;
  constructor(readonly color: string) {
    super();
    this.isValid = false;
    try {
      this.colorObj = new Color(color);
      this.inP3 = this.colorObj.inGamut('p3');
      this.isValid = true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.isValid = false;
    }
  }

  eq(other: ColorWidget): boolean {
    return other.color === this.color;
  }

  toDOM(): HTMLSpanElement | HTMLDivElement {
    if (!this.isValid) return document.createElement('span');
    const wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.className = 'cm-color-swatch';
    wrap.style.setProperty('--color', this.color);
    if (this.inP3) wrap.setAttribute('in-gamut', 'in-gamut');
    else wrap.setAttribute('title', 'Outside of P3 gamut');
    const box = wrap.appendChild(document.createElement('div'));
    box.innerText = ' ';
    return wrap;
  }
}

export const colorDecorator = ViewPlugin.fromClass(
  class {
    colors: DecorationSet;
    constructor(view: EditorView) {
      this.colors = colorPhrases(view);
    }

    update(update: ViewUpdate): void {
      if (
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) !== syntaxTree(update.state)
      )
        this.colors = colorPhrases(update.view);
    }
  },
  {
    decorations: instance => instance.colors,
    provide: plugin =>
      EditorView.atomicRanges.of(view => {
        return view.plugin(plugin)?.colors || Decoration.none;
      }),
  }
);
