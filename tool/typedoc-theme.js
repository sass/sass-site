const {
  DefaultTheme,
  DefaultThemeRenderContext,
  JSX,
  UrlMapping,
} = require('typedoc');

function bind(fn, first) {
  return (...r) => fn(first, ...r);
}

class SassSiteRenderContext extends DefaultThemeRenderContext {
  // We don't include Typedoc's JS, so the default means of displaying overloads
  // as multiple togglable definitions within a single member documentation
  // doesn't work. Instead, we emit each overload as a separate entry with its
  // own panel.
  oldMember = this.member;
  member = bind(function (context, props) {
    const signatures = props?.signatures;
    if (signatures && signatures.length > 1) {
      const element = JSX.createElement(
        JSX.Fragment,
        null,
        ...signatures.map((signature) => {
          props.signatures = [signature];
          return context.oldMember(props);
        }),
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
      (tag) => tag.tag === '@compatibility',
    );
    props.comment.removeTags('@compatibility');

    const parent = this.oldComment(props);
    if (!parent) return;

    parent.children.unshift(
      ...compatibilityTags.map((compat) => {
        // Compatibility tags should have a single text block.
        const text = compat.content[0].text;

        // The first line is arguments to impl_status, anything after that is the
        // contents of the block.
        const lineBreak = text.indexOf('\n');
        const firstLine =
          lineBreak === -1 ? text : text.substring(0, lineBreak);
        const rest =
          lineBreak === -1 ? null : text.substring(lineBreak + 1).trim();

        return JSX.createElement(JSX.Raw, {
          html:
            `<% impl_status(${firstLine}) ${rest ? 'do' : ''} %>` +
            context.markdown(rest) +
            (rest ? '<% end %>' : ''),
        });
      }),
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
          '<% heads_up do %>$1<% end %>',
        )
        .replace(
          /<p><strong>Fun fact!<\/strong>([^]*?)<\/p>/g,
          '<% fun_fact do %>$1<% end %>',
        ),
    this,
  );

  // Relative URLs don't work well for index pages since they can be rendered at
  // different directory levels, so we just convert all URLs to absolute to be
  // safe.
  oldUrlTo = this.urlTo;
  urlTo = bind(function (context, reflection) {
    const relative = context.oldUrlTo(reflection);

    const absolute = new URL(
      relative,
      `relative:///documentation/js-api/${context.theme.markedPlugin.location}`,
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
      this.application.options,
    );
    return this.contextCache;
  }

  render(page, template) {
    const context = this.getRenderContext(page);

    // The default header includes a search bar that we don't want, so we just
    // render title on its own.
    const breadcrumb = page.model.parent
      ? `<ul class="tsd-breadcrumb">${JSX.renderElement(
          context.breadcrumb(page.model),
        )}</ul>`
      : '';
    const heading =
      (page.model.kindString === 'Project'
        ? ''
        : `${page.model.kindString || ''} `) +
      page.model.name +
      (page.model.typeParameters
        ? `&lt;${page.model.typeParameters
            .map((item) => item.name)
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

  getUrls(project) {
    return super
      .getUrls(project)
      .map(
        (mapping) =>
          new UrlMapping(`${mapping.url}.erb`, mapping.model, mapping.template),
      );
  }
}

// TODO: See if there's a graceful way to support "Heads up!" and Compatibility
// annotations as @-tags rather than needing to write out the HTML by hand.

exports.load = (app) => {
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
