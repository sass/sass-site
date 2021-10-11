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

  // Make categories visible in the sidebar as well as in the main page's index.
  // Hopefully this will no longer be necessary once TypeStrong/typedoc#1532 is
  // implemented.
  oldNavigation = this.navigation;
  navigation = bind(function(context, props) {
    const navigation = context.oldNavigation(props);
    const childrenByCategories = context._groupByCategory(props.model);
    if (childrenByCategories.size === 0) return navigation;

    const secondary = context._getNthChild(navigation, 1);
    if (!secondary) return navigation;

    const firstLI = context._getNthChild(context._getNthChild(secondary, 0), 0);
    const ul = firstLI.props["class"].startsWith("current ")
        ? context._getNthChild(firstLI, 1)
        : context._getNthChild(secondary, 0);

    ul.children = Array.from(childrenByCategories).map(([title, children]) =>
        JSX.createElement(JSX.Fragment, null,
            JSX.createElement("li", {class: "sl-tsd-category-label"},
                JSX.createElement("span", null, title)),
            ...children.map(child =>
                JSX.createElement("li", {class: child.cssClasses},
                    JSX.createElement("a", {
                      href: context.urlTo(child), class: "tsd-kind-icon"
                    }, child.name)))));

    return navigation;
  }, this);

  // Returns the first child of a JSX node. For some reason, JSX nodes created
  // by TypeDoc can contain nested arrays, so this traverses them.
  _getNthChild = (node, n) => {
    let i = 0;

    function traverse(array) {
      for (const element of array) {
        if (element instanceof Array) {
          const result = traverse(element);
          if (result != undefined) return result;
        } else {
          if (i === n) return element;
          i++;
        }
      }
    }

    return traverse(node.children);
  };

  // Returns a map from category titles to the set of members of those
  // categories.
  _groupByCategory = (model) => {
    const map = new Map();
    function addCategoriesToMap(categories) {
      for (const category of categories) {
        const children = map.get(category.title);
        if (children) {
          children.push(...category.children);
        } else {
          map.set(category.title, [...category.children]);
        }
      }
    }

    if (model.categories) {
      addCategoriesToMap(model.categories);
    } else if (model.groups) {
      for (const group of model.groups) {
        if (group.categories) addCategoriesToMap(group.categories);
      }
    }

    return map;
  };

  // Add compatibility indicators to the beginning of documentation blocks.
  oldComment = this.comment;
  comment = bind((context, props) => {
    const compatibilityTags = props.comment?.tags
        .filter(tag => tag.tagName === "compatibility");
    props.comment?.removeTags("compatibility");

    const parent = this.oldComment(props);
    if (!parent) return;

    parent.children.unshift(...compatibilityTags.map(compat => {
      // The first line is arguments to impl_status, anything after that is the
      // contents of the block.
      const lineBreak = compat.text.indexOf("\n");
      const firstLine =
          lineBreak === -1 ? compat.text : compat.text.substring(0, lineBreak);
      const rest =
          lineBreak === -1 ? null : compat.text.substring(lineBreak + 1).trim();

      return JSX.createElement(JSX.Raw, {
        html: `<% impl_status(${firstLine}) ${rest ? 'do' : ''} %>` +
            context.markdown(rest) +
            (rest ? '<% end %>' : '')
      });
    }));

    return parent;
  }, this);

  // Convert paragraphs that start with **Heads up!** or **Fun fact!** into
  // proper callouts.
  oldMarkdown = this.markdown;
  markdown = bind((context, text) =>
      context.oldMarkdown(text)
          .replace(
              /<p><strong>Heads up!<\/strong>([^]*?)<\/p>/g,
              '<% heads_up do %>$1<% end %>')
          .replace(
              /<p><strong>Fun fact!<\/strong>([^]*?)<\/p>/g,
              '<% fun_fact do %>$1<% end %>'),
      this);
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
