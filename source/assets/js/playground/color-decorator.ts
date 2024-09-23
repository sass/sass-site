import {
  EditorView,
  WidgetType,
  ViewUpdate,
  ViewPlugin,
  DecorationSet,
  Decoration,
} from '@codemirror/view';
import {Range} from '@codemirror/state';
import {syntaxTree} from '@codemirror/language';

function colorPhrases(view: EditorView) {
  let widgets: Range<Decoration>[] = []
  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (["CallExpression", "ColorLiteral"].includes(node.name)) {
          let colorString = view.state.doc.sliceString(node.from, node.to);
          let deco = Decoration.widget({
            widget: new ColorWidget(colorString),
            side: 1,
          })
          widgets.push(deco.range(node.to))
        }
      }
    })
  }
  return Decoration.set(widgets)
}


class ColorWidget extends WidgetType {
  colorObj: any;
  inP3: boolean | undefined;
  isValid: boolean;
  constructor(readonly color: string) {
    super();
    this.isValid = false;
    try {   
      this.colorObj = new Color(color);
      this.inP3 = this.colorObj.inGamut('p3');
      this.isValid = true;
    } catch (error) {
      this.isValid = false;
    }
  }

  eq(other: ColorWidget) {
    return other.color == this.color;
  }

  toDOM() {
    if(!this.isValid) return document.createElement('span');
    let wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.className = 'cm-color-swatch';
    wrap.style.setProperty('--color',this.color);
    if(this.inP3) wrap.setAttribute('in-gamut','in-gamut');
    else wrap.setAttribute('title', 'Outside of P3 gamut');
    let box = wrap.appendChild(document.createElement('div'));
    box.innerText = ' ';
    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

export const colorDecorator = ViewPlugin.fromClass(
  class {
    colors: DecorationSet;
    constructor(view: EditorView) {
      this.colors = colorPhrases(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged ||
          syntaxTree(update.startState) != syntaxTree(update.state))
        this.colors = colorPhrases(update.view)
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


/**
 * TODO:
 * Import colorjs
 * Check for other color formats besides function or hex
 * Narrow when color object gets made (only for oklch, etc functions)
 * Only make decorator if valid
 * Don't make decorator if variable in color function
 * Revisit decorator vs swatch naming
 */