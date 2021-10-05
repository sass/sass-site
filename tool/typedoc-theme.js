const {DefaultTheme, DefaultThemeRenderContext, JSX, UrlMapping} = require('typedoc');

function bind(fn, first) {
  return (...r) => fn(first, ...r);
}

class SassSiteRenderContext extends DefaultThemeRenderContext {
  // Link to the external documentation of external APIs. Unfortunately, there's
  // no way to use `addUnknownSymbolResolver` for names that don't come from npm
  // packages.
  attemptExternalResolution = function(symbol) {
    if (symbol.escapedName === 'URL') {
      return 'https://developer.mozilla.org/en-US/docs/Web/API/URL';
    } else if (symbol.escapedName === 'Buffer') {
      return 'https://nodejs.org/api/buffer.html';
    } else {
      return null;
    }
  };

  // We don't include Typedoc's JS, so the default means of displaying overloads
  // as multiple togglable definitions within a single member documentation
  // doesn't work. Instead, we emit each overload as a separate entry with its
  // own panel.
  oldMember = this.member;
  member = bind(function(context, props) {
    const signatures = props?.signatures;
    if (signatures && signatures.length > 1) {
      const element = JSX.createElement(JSX.Fragment, null,
        ...signatures.map(signature => {
          props.signatures = [signature];
          return context.oldMember(props);
        }));
      props.signatures = signatures;
      return element;
    }

    return context.oldMember(props);
  }, this);
}

class SassSiteTheme extends DefaultTheme {
  constructor(renderer) {
    super(renderer);

    // This is an ugly monkeypatch but it's necessary to work around
    // TypeStrong/typedoc#1731.
    //
    // Relative URLs don't work well for index pages since they can be rendered at
    // different directory levels, so we just convert all URLs to absolute to be
    // safe.
    const ContextAwareRendererComponent =
        Object.getPrototypeOf(this.markedPlugin.constructor);
    const oldGetRelativeUrl =
        ContextAwareRendererComponent.prototype.getRelativeUrl;
    ContextAwareRendererComponent.prototype.getRelativeUrl = function(url) {
      const relative = oldGetRelativeUrl.call(this, url);

      const absolute = new URL(
        relative,
        `relative:///documentation/js-api/${this.location}`
      );
      absolute.pathname = absolute.pathname
        .replace(/\.html$/, '')
        .replace(/\/index$/, '');
      return absolute.toString().replace(/^relative:\/\//, '');
    };
  }

  getRenderContext() {
    this.contextCache ??=
        new SassSiteRenderContext(this, this.application.options);
    return this.contextCache;
  }

  render(page) {
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
    <div class="row">
      <div class="col-8 col-content">
        ${JSX.renderElement(page.template(page))}
      </div>
      <div class="col-4 col-menu menu-sticky-wrap menu-highlight">
        ${JSX.renderElement(context.navigation(page))}
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
        mapping =>
          new UrlMapping(`${mapping.url}.erb`, mapping.model, mapping.template)
      );
  }
}

// TODO: See if there's a graceful way to support "Heads up!" and Compatibility
// annotations as @-tags rather than needing to write out the HTML by hand.

exports.load = app => {
  app.renderer.addUnknownSymbolResolver('immutable', (name) =>
      `https://immutable-js.com/docs/latest@main/${name}/`);
  app.renderer.addUnknownSymbolResolver('source-map-js', (name) => {
    if (name === 'RawSourceMap') {
      return 'https://github.com/mozilla/source-map/blob/58819f09018d56ef84dc41ba9c93f554e0645169/source-map.d.ts#L15-L23';
    }
  });

  app.renderer.defineTheme('sass-site', SassSiteTheme);
};
