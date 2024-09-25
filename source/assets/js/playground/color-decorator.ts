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
  'color',
  'hsl',
  'hsla',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'rgb',
  'rgba',
];

/** Parses content to add {@link ColorWidget} s after valid color declarations. */
function getColorDecorations(view: EditorView): DecorationSet {
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
            // Ensure the CallExpression is a color.
            !COLOR_FUNCTIONS.some(func => colorString.split('(')[0] === func)
          ) {
            return;
          }
          try {
            const color = new Color(colorString);
            const deco = Decoration.widget({
              widget: new ColorWidget(color),
              side: 1,
            });
            widgets.push(deco.range(node.to));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // Color constuctor throws when colorString does not represent a
            // color.
            return;
          }
        }
      },
    });
  }
  return Decoration.set(widgets, true);
}

/** A {@link WidgetType} showing a color and gamut info. */
class ColorWidget extends WidgetType {
  inP3: boolean | undefined;
  constructor(readonly color: Color) {
    super();
    this.inP3 = this.color.inGamut('p3');
  }

  eq(other: ColorWidget): boolean {
    return other.color === this.color;
  }

  toDOM(): HTMLDivElement {
    return colorSwatchView(this.color.toString(), Boolean(this.inP3));
  }
}

/* Generates div with color swatch and out of gamut warning. */
export function colorSwatchView(
  color: string,
  inP3Gamut: boolean
): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.className = 'cm-color-swatch';
  wrap.style.setProperty('--color', color);
  const box = wrap.appendChild(document.createElement('div'));
  box.innerText = ' ';

  if (inP3Gamut) wrap.setAttribute('in-gamut', 'in-gamut');
  else {
    wrap.setAttribute('title', 'Outside of P3 gamut');
    const warning = document.createElement('span');
    warning.innerText = '⚠️';
    wrap.appendChild(warning);
  }

  return wrap;
}

/** A {@link ViewPlugin} that shows colors inline with their declarations. */
export const colorDecorator = ViewPlugin.fromClass(
  class {
    colors: DecorationSet;
    constructor(view: EditorView) {
      this.colors = getColorDecorations(view);
    }

    update(update: ViewUpdate): void {
      if (
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) !== syntaxTree(update.state)
      )
        this.colors = getColorDecorations(update.view);
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
