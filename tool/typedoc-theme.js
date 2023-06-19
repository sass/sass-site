// eslint-disable-next-line node/no-missing-require
const {DefaultTheme, DefaultThemeRenderContext, JSX} = require('typedoc');

function bind(fn, first) {
  return (...r) => fn(first, ...r);
}

/**
 * Take text `input` and converts it into a string of all arguments suitable for
 * the `{% compatibility %}` tag.
 */
function parseCompatibility(input) {
  return input
    .split(',')
    .map(arg => `'${arg.trim()}'`)
    .join(', ');
}

class SassSiteRenderContext extends DefaultThemeRenderContext {
  // We don't include Typedoc's JS, so the default means of displaying overloads
  // as multiple togglable definitions within a single member documentation
  // doesn't work. Instead, we emit each overload as a separate entry with its
  // own panel.
  oldMember = this.member;
  member = bind((context, props) => {
    const signatures = props?.signatures;
    if (signatures && signatures.length > 1) {
      const element = JSX.createElement(
        JSX.Fragment,
        null,
        ...signatures.map(signature => {
          props.signatures = [signature];
          return context.oldMember(props);
        })
      );
      props.signatures = signatures;
      return element;
    }

    return context.oldMember(props);
  }, this);

  // Add compatibility indicators to the beginning of documentation blocks.
  oldComment = this.comment;
  comment = bind((context, props) => {
    if (!props.comment) return;
    const compatibilityTags = props.comment.blockTags.filter(
      tag => tag.tag === '@compatibility'
    );
    props.comment.removeTags('@compatibility');

    const parent = this.oldComment(props);
    if (!parent) return;

    parent.children.unshift(
      ...compatibilityTags.map(compat => {
        // Compatibility tags should have a single text block.
        const text = compat.content[0].text;

        // The first line is arguments to `{% compatibility %}` tag, anything
        // after that is the contents of the block.
        const lineBreak = text.indexOf('\n');
        const compatibilityArgs = parseCompatibility(
          lineBreak === -1 ? text : text.substring(0, lineBreak)
        );
        const restOfFirst =
          lineBreak === -1 ? null : text.substring(lineBreak + 1);

        const rest = [
          ...(restOfFirst ? [{kind: 'text', text: restOfFirst}] : []),
          ...compat.content.slice(1),
        ];

        return JSX.createElement(JSX.Raw, {
          html:
            `{% compatibility ${compatibilityArgs} %}` +
            (rest ? context.markdown(rest) : '') +
            '{% endcompatibility %}',
        });
      })
    );

    return parent;
  }, this);

  // Convert paragraphs that start with **Heads up!** or **Fun fact!** into
  // proper callouts.
  oldMarkdown = this.markdown;
  markdown = bind(
    (context, text) =>
      context
        .oldMarkdown(text)
        .replace(
          /<p><strong>Heads up!<\/strong>([^]*?)<\/p>/g,
          '{% headsUp %}$1{% endheadsUp %}'
        )
        .replace(
          /<p><strong>Fun fact!<\/strong>([^]*?)<\/p>/g,
          '{% funFact %}$1{% endfunFact %}'
        ),
    this
  );

  // Relative URLs don't work well for index pages since they can be rendered at
  // different directory levels, so we just convert all URLs to absolute to be
  // safe.
  oldUrlTo = this.urlTo;
  urlTo = bind((context, reflection) => {
    const relative = context.oldUrlTo(reflection);

    const absolute = new URL(
      relative,
      `relative:///documentation/js-api/${context.theme.markedPlugin.location}`
    );
    absolute.pathname = absolute.pathname
      .replace(/\.html$/, '')
      .replace(/\/index$/, '');
    return absolute.toString().replace(/^relative:\/\//, '');
  }, this);
}

class SassSiteTheme extends DefaultTheme {
  getRenderContext(page) {
    this.contextCache ??= new SassSiteRenderContext(
      this,
      page,
      this.application.options
    );
    return this.contextCache;
  }

  render(page, template) {
    const context = this.getRenderContext(page);

    // The default header includes a search bar that we don't want, so we just
    // render title on its own.
    const breadcrumb = page.model.parent
      ? `<ul class="tsd-breadcrumb">${JSX.renderElement(
          context.breadcrumb(page.model)
        )}</ul>`
      : '';
    const heading =
      (page.model.kindString === 'Project'
        ? ''
        : `${page.model.kindString || ''} `) +
      page.model.name +
      (page.model.typeParameters
        ? `&lt;${page.model.typeParameters
            .map(item => item.name)
            .join(', ')}&gt;`
        : '');

    // The default template renders a full HTML document, but for the Sass site
    // we want it to be a page within the normal layout so we just render the
    // contents with a header that provides the title tag. We also wrap it in a
    // div with class "typedoc" so we can isolate the typedoc-specific CSS.
    return `---
title: ${JSON.stringify(`${page.model.name} | JS API`)}
---

<div class="typedoc">
  <header>
    <div class="tsd-page-title">
      <div class="container">
        ${breadcrumb}
        <h1>${heading}</h1>
      </div>
    </div>
  </header>

  <div class="container container-main">
    <div class="col-content">
      ${JSX.renderElement(template(page))}
    </div>
    <div class="col-sidebar">
      <div class="site-menu">
        ${JSX.renderElement(context.sidebar(page))}
      </div>
    </div>
  </div>
</div>
`;
  }
}

exports.load = app => {
  app.converter.addUnknownSymbolResolver((ref, refl, part, symbolId) => {
    if (!symbolId) return;
    const name = symbolId.qualifiedName;

    switch (ref.moduleSource) {
      case 'immutable':
        return `https://immutable-js.com/docs/latest@main/${name}/`;
      case 'source-map-js':
        if (name === 'RawSourceMap') {
          return 'https://github.com/mozilla/source-map/blob/58819f09018d56ef84dc41ba9c93f554e0645169/source-map.d.ts#L15-L23';
        }
        break;
      case '@types/node':
        if (name === 'Buffer') {
          return 'https://nodejs.org/api/buffer.html';
        }
        break;

      case 'typescript':
        switch (name) {
          case 'URL':
            return 'https://developer.mozilla.org/en-US/docs/Web/API/URL';
          case 'Promise':
            return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise';
        }
        break;
    }
  });

  app.renderer.defineTheme('sass-site', SassSiteTheme);
};
