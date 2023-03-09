---
title: "Request for Comments: New JS API"
author: Natalie Weizenbaum
date: 2021-08-05 15:30:00 -8
---

I'm excited to officially unveil something that's been in the works for quite a
while now: a (proposal for a) brand new JavaScript API for Sass. This API has
been redesigned from the ground up based on lessons learned from both the Node
Sass API and various other historical Sass APIs in other languages through the
years, and it addresses many of the shortcomings of the existing API.

The API has four main components, all of which I'll cover in this post:

* [The core compilation API](#compilation)
* [The logger API](#loggers)
* [The importer API](#importers)
* [The function API](#functions)

As you read on, remember that this API is still just a proposal. We want to hear
from you, our users, whether it meets your needs and how we can improve it
before we lock it in to a full release. So go ahead and make your voices known
[on the issue tracker]!

[on the issue tracker]: https://github.com/sass/sass/issues/new

## Why a New API?

The existing JavaScript API is showing its age. It predates Dart Sass, having
been originally designed for the `node-sass` package, which wrapped the
now-[deprecated] [LibSass] implementation. (That's why we call it the "Node Sass
API"!) It grew organically and often messily along with LibSass, and ended up
with more than a few awkward legacy behaviors. Many of these behaviors are more
of a pain for implementation than anything else, but a few of them made life
quite difficult:

[deprecated]: /blog/libsass-is-deprecated
[LibSass]: /libsass

* The importer API was built around file paths rather than URLs, and was tightly
  coupled to the physical filesystem. This made it impossible to override *all*
  file-based loads and present a fully virtual filesystem, and caused custom
  Node importers to interact poorly with the new [module system].

* The function API was built around mutable value objects, which runs counter to
  Sass's immutable nature. It also provided no utility methods (such as looking
  up a key in a map) to make it easier to implement idiomatic custom functions,
  and didn't provide access to crucial information about values such as whether
  strings were quoted.

* All of the asynchronous functions were callback-based rather than
  promise-based.

[module system]: https://sass-lang.com/blog/the-module-system-is-launched

The new API addresses these issues and more with a modern, idiomatic API that
will make working with Sass from JS a breeze.

## Compilation

At the heart of the API are four functions that do the actual Sass compilation,
two synchronous and two asynchronous. They're presented here in TypeScript
syntax to clarify exactly what they take and return, but you can always call
them from plain JS:

```ts
function compile(
  path: string,
  options?: Options<'sync'>
): CompileResult;

function compileString(
  source: string,
  options?: StringOptions<'sync'>
): CompileResult;

function compileAsync(
  path: string,
  options?: Options<'async'>
): Promise<CompileResult>;

function compileStringAsync(
  source: string,
  options?: StringOptions<'async'>
): Promise<CompileResult>;
```

The `compile()` and `compileAsync()` functions load a Sass file from a path on
disk, whereas `compileString()` and `compileStringAsync()` compile Sass source
code passed in as a string. All these take the following options:

* `alertAscii`: Whether errors and warnings should use only ASCII characters (as
  opposed to, for example, Unicode box-drawing characters).
* `alertColor`: Whether errors and warnings should use terminal colors.
* `loadPaths`: A list of file paths to use to look up files to load, just like
  `includePaths` in the old API.
* `importers`: A list of [custom importers](#importers) to use to load Sass
  source files.
* `functions`: An object whose keys are Sass function signatures and whose
  values are [custom functions](#functions).
* `quietDeps`: Whether to silence deprecation warnings in dependencies.
* `logger`: The [custom logger](#loggers) to use to emit warnings and debug
  messages.
* `sourceMap`: Whether to generate a source map during compilation.
* `style`: The output style, `'compressed'` or `'expanded'`.
* `verbose`: Whether to emit every deprecation warning encountered.

The `compileString()` and `compileStringAsync()` functions take a few additional
options:

* `syntax`: The syntax of the file, `'scss'` (the default), `'indented'`, or
  `'css'`.
* `url`: The [canonical URL](#canonicalizing) of the file.
* `importer`: The [custom importer](#importers) to treat as the file's source.
  If this is passed, this importer will be used to resolve relative loads from
  this stylesheet.

All these functions return an object with the following fields:

* `css`: The compiled CSS, as a string.
* `loadedUrls`: All the URLs loaded during the compilation, in no particular
  order.
* `sourceMap`: The source map for the file if `sourceMap: true` was passed, as
  a decoded object.

As with the Node Sass API, the synchronous functions will be substantially
faster than their asynchronous counterparts. Unfortunately the new API will not
support the `fibers` option for speeding up asynchronous compilation, since [the
`fibers` package has been discontinued].

[the `fibers` package has been discontinued]: /blog/node-fibers-discontinued

## Loggers

The logger API gives you more fine-grained control over how and when warnings
and debug messages are emitted. Unlike other aspects of this proposal, a
`logger` option will also be added to the *old* API to allow you to control your
messages there without needing to upgrade to the new API immediately.

A logger implements the following interface:

```ts
interface Logger {
  warn?(
    message: string,
    options: {
      deprecation: boolean;
      span?: SourceSpan;
      stack?: string;
    }
  ): void;

  debug?(
    message: string,
    options: {span: SourceSpan}
  ): void;
}
```

The `warn` function handles warnings, including both warnings from the compiler
itself and from `@warn` rules. It's passed:

* The warning message
* A flag indicating whether it's specifically a deprecation warning
* A span indicating where the warning was located, if it comes from a specific
  location
* The Sass stack trace at the point at which the warning was encountered, if it
  was encountered during execution

The `debug` function handles only `@debug` rules, and is just passed the message
and the rule's span. For more information on the `SourceSpan` type, see [the
Logger proposal].

[the Logger proposal]: https://github.com/sass/sass/tree/main/proposal/js-logger.d.ts

Sass will also provide a built-in logger, `Logger.silent`, that never emits any
messages. This will allow you to easily run Sass in "quiet mode" where no
warnings are ever surfaced.

## Importers

Rather than modeling importers as single-function callbacks, the new API models
them as objects that expose two methods: one that _canonicalizes_ a URL, and one
that _loads_ a canonical URL.

```ts
// Importers for compileAsync() and compileStringAsync() are the same, except
// they may return Promises as well.
interface Importer {
  canonicalize(
    url: string,
    options: {fromImport: boolean}
  ): URL | null;

  load(canonicalUrl: URL): ImporterResult | null;
}
```

Note that even stylesheets that are loaded directly from the filesystem through
`compile()` or `loadPaths` are treated as though they're loaded by an importer.
This built-in filesystem importer canonicalizes all paths to `file:` URLs, and
loads those URLs from the physical filesystem.

### Canonicalizing

The first step determines the canonical URL for a stylesheet. Each stylesheet
has exactly one canonical URL that in turn refers to exactly one stylesheet. The
canonical URL must be absolute, including a scheme, but the specific structure
is up to the importer. In most cases, the stylesheet in question will exist on
disk and the importer will just return a `file:` URL for it.

The `canonicalize()` method takes a URL string that may be either relative or
absolute. If the importer recognizes that URL, it returns a corresponding
absolute URL (including a scheme). This is the _canonical URL_ for the
stylesheet in question. Although the input URL may omit a file extension or
an initial underscore, the canonical URL must be fully resolved.

For a stylesheet that's loaded from the filesystem, the canonical URL will be
the absolute `file:` URL of the physical file on disk. If it's generated
in-memory, the importer should choose a custom URL scheme to guarantee that
its canonical URLs don't conflict with any other importer's.

For example, if you're loading Sass files from a database, you might use the
scheme `db:`. The canonical URL for a stylesheet associated with key `styles`
in the database might be `db:styles`.

This function also takes a `fromImport` option that indicates whether the
importer is being invoked from an `@import` rule (as opposed to `@use`,
`@forward`, or `meta.load-css()`).

Having a canonical URL for each stylesheet allows Sass to ensure that the
same stylesheet isn't loaded multiple times in the new module system.

#### Canonicalizing Relative Loads

When a stylesheet tries to load a relative URL, such as `@use "variables"`, it's
not clear from the document itself whether that refers to a file that exists
relative to the stylesheet or to another importer or load path. Here's how the
importer API resolves that ambiguity:

* First, the relative URL is resolved relative to the canonical URL of the
  stylesheet that contained the `@use` (or `@forward` or `@import`). For
  example, if the canonical URL is `file:///path/to/my/_styles.scss`, then the
  resolved URL will be `file:///path/to/my/variables`.

* This URL is then passed to the `canonicalize()` method of the importer that
  loaded the old stylesheet. (That means it's important for your importers to
  support absolute URLs!) If the importer recognizes it, it returns the
  canonical value which is then passed to that importer's `load()`; otherwise,
  it returns `null`.

* If the old stylesheet's importer didn't recognize the URL, it's passed to all
  the `importers`' canonicalize functions in the order they appear in `options`,
  then checked for in all the `loadPaths`. If none of those recognizes it, the
  load fails.

It's important that local relative paths take precedence over other importers or
load paths, because otherwise your local stylesheets could get unexpectedly
broken by a dependency adding a file with a conflicting name.

### Loading

The second step actually loads the text of the stylesheet. The `load()`
method takes a canonical URL that was returned by `canonicalize()` and
returns the contents of the stylesheet at that URL. This is only called once
per compilation for each canonical URL; future loads of the same URL will
re-use either the existing module (for `@use` and `@forward`) or the parse
tree (for `@import`).

The `load()` method returns an object with the following fields:

* `css`: The text of the loaded stylesheet.
* `syntax`: The syntax of the file: `'scss'`, `'indented'`, or `'css'`.
* `sourceMapUrl`: An optional browser-accessible `URL` to include in source maps
  when referring to this file.

### `FileImporter`

This proposal also adds a special type of importer known as a `FileImporter`.
This importer makes the common case of redirecting loads to somewhere on the
physical filesystem easier. It doesn't require the caller to implement
`load()`, since that's always going to be the same for files on disk.

```ts
interface FileImporter {
  findFileUrl(
    url: string,
    options: {fromImport: boolean}
  ): FileImporterResult | null;
}
```

The `findFileUrl()` method takes a relative URL and returns an object with the
following fields:

* `url`: The absolute `file:` URL of the file to load. This URL doesn't need to
  be fully canonicalized: the Sass compiler will take care of resolving
  partials, file extensions, index files, and so on.
* `sourceMapUrl`: An optional browser-accessible `URL` to include in source maps
  when referring to this file.

## Functions

The new function API's function type is very similar to the old API's:

```ts
type CustomFunctionCallback = (args: Value[]) => Value;
```

The only differences are:

* Async functions return a `Promise<Value>` rather than calling a callback.
* The value types themselves are different.

The second point is pretty substantial, though! The new value types are much
more fleshed out than the old versions. Let's start with the parent class:

```ts
abstract class Value {
  /**
   * Returns the values of `this` when interpreted as a list.
   *
   * - For a list, this returns its elements.
   * - For a map, this returns each of its key/value pairs as a `SassList`.
   * - For any other value, this returns a list that contains only that value.
   */
  get asList(): List<Value>;

  /** Whether `this` is a bracketed Sass list. */
  get hasBrackets(): boolean;

  /** Whether `this` is truthy (any value other than `null` or `false`). */
  get isTruthy(): boolean;

  /** Returns JS's null if this is `sassNull`, or `this` otherwise. */
  get realNull(): null | Value;

  /** If `this` is a list, return its separator. Otherwise, return `null`. */
  get separator(): ListSeparator;

  /**
   * Converts the Sass index `sassIndex` to a JS index into the array returned
   * by `asList`.
   *
   * Sass indices start counting at 1, and may be negative in order to index
   * from the end of the list.
   */
  sassIndexToListIndex(sassIndex: Value): number;

  /**
   * Returns `this` if it's a `SassBoolean`, and throws an error otherwise.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of a parameter passed to the custom function (without the `$`).
   */
  assertBoolean(name?: string): SassBoolean;

  /**
   * Returns `this` if it's a `SassColor`, and throws an error otherwise.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of a parameter passed to the custom function (without the `$`).
   */
  assertColor(name?: string): SassColor;

  /**
   * Returns `this` if it's a `SassFunction`, and throws an error otherwise.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of the parameter passed to the custom function (without the `$`).
   */
  assertFunction(name?: string): SassFunction;

  /**
   * Returns `this` if it's a `SassMap` (or converts it to a `SassMap` if it's
   * an empty list), and throws an error otherwise.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of the parameter passed to the custom function (without the `$`).
   */
  assertMap(name?: string): SassMap;

  /**
   * Returns `this` if it's a `SassNumber`, and throws an error otherwise.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of a parameter passed to the custom function (without the `$`).
   */
  assertNumber(name?: string): SassNumber;

  /**
   * Returns `this` if it's a `SassString`, and throws an error otherwise.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of a parameter passed to the custom function (without the `$`).
   */
  assertString(name?: string): SassString;

  /**
   * Returns the value of `this` if it can be interpreted as a map.
   *
   * - If this is a map, returns its contents.
   * - If this is an empty list, returns an empty map.
   * - Otherwise, returns `null`.
   */
  tryMap(): OrderedMap<Value, Value> | null;

  /** Returns whether `this == other` in SassScript. */
  equals(other: Value): boolean;
}
```

There are a couple important things to note here:

* Because CSS doesn't have a strong syntactic differentiation between a single
  element and a list containing one element, any Sass value may be treated as
  though it's a list. The `Value` makes it easy to follow this convention by
  making the `asList()`, `hasBrackets()`, and `separator()` getters available
  for every `Value`.

* The list returned this was and the map returned by `asMap()` are immutable
  types from the [`immutable` package]. This reflects Sass's built-in
  immutability of all its types. Although these values can't be modified
  directly, their APIs make it easy and efficient to create new values with
  changes applied.

* Sass's list-indexing conventions are different than JavaScript's. The
  `sassIndexToListIndex()` function makes it easy to convert from Sass index to
  JS index.

* In Sass, any value may be used in a boolean context, with `false`
  and `null` counting as "falsey" values. The `isTruthy` getter makes this
  convention easy to follow.

* The `assert*()` functions make it easy to ensure that you're being passed the
  arguments you expect, and to throw an idiomatic error if you're not. They're
  particularly useful for TypeScript users since they'll automatically narrow
  the type of the `Value`.

[`immutable` package]: https://immutable-js.com/

Most Sass values have their own subclasses, but there are three singleton values
that are just available as constants: `sassTrue`, `sassFalse`, and `sassNull`
represent Sass's `true`, `false`, and `null` values respectively.

### Colors

The new API's `SassColor` class provides access to colors in RGB, HSL, and HWB
format. As with built-in Sass color functions, any attribute can be accessed on
any color regardless of how it was initially created.

```ts
class SassColor extends Value {
  /** Creates an RGB color. */
  static rgb(
    red: number,
    green: number,
    blue: number,
    alpha?: number
  ): SassColor;

  /** Creates an HSL color. */
  static hsl(
    hue: number,
    saturation: number,
    lightness: number,
    alpha?: number
  ): SassColor;

  /** Creates an HWB color. */
  static hwb(
    hue: number,
    whiteness: number,
    blackness: number,
    alpha?: number
  ): SassColor;

  /** The color's red channel. */
  get red(): number;

  /** The color's green channel. */
  get green(): number;

  /** The color's blue channel. */
  get blue(): number;

  /** The color's hue. */
  get hue(): number;

  /** The color's saturation. */
  get saturation(): number;

  /** The color's lightness. */
  get lightness(): number;

  /** The color's whiteness. */
  get whiteness(): number;

  /** The color's blackeness. */
  get blackness(): number;

  /** The color's alpha channel. */
  get alpha(): number;

  /**
   * Returns a copy of `this` with the RGB channels updated to match `options`.
   */
  changeRgb(options: {
    red?: number;
    green?: number;
    blue?: number;
    alpha?: number;
  }): SassColor;

  /**
   * Returns a copy of `this` with the HSL values updated to match `options`.
   */
  changeHsl(options: {
    hue?: number;
    saturation?: number;
    lightness?: number;
    alpha?: number;
  }): SassColor;

  /**
   * Returns a copy of `this` with the HWB values updated to match `options`.
   */
  changeHwb(options: {
    hue?: number;
    whiteness?: number;
    blackness?: number;
    alpha?: number;
  }): SassColor;

  /** Returns a copy of `this` with `alpha` as its alpha channel. */
  changeAlpha(alpha: number): SassColor;
}
```

### Numbers

The `SassNumber` class stores its numerator and denominator units as arrays
rather than strings. In addition, it provides methods for asserting that it has
specific units (`assertNoUnits()`, `assertUnit()`) and for converting it to
specific units (`convert()`, `convertToMatch()`, `convertValue()`,
`convertValueToMatch()`, `coerce()`, `coerceValue()`, `coerceValueToMatch()`).

Sass's numeric logic is also subtly different from JS, since Sass considers
numbers that differ by less than the 10th decimal digit to be identical. This
API provides a number of methods that help convert between this and JavaScript's
numeric logic.

```ts
class SassNumber extends Value {
  /** Creates a Sass number with no units or a single numerator unit. */
  constructor(value: number, unit?: string);

  /** Creates a Sass number with multiple numerator and/or denominator units. */
  static withUnits(
    value: number,
    options?: {
      numeratorUnits?: string[] | List<string>;
      denominatorUnits?: string[] | List<string>;
    }
  ): SassNumber;

  /** This number's value. */
  get value(): number;

  /**
   * Whether `value` is an integer according to Sass's numeric logic.
   *
   * The integer value can be accessed using `asInt`.
   */
  get isInt(): boolean;

  /**
   * If `value` is an integer according to Sass's numeric logic, returns the
   * corresponding JS integer, or `null` if `value` isn't an integer.
   */
  get asInt(): number | null;

  /** This number's numerator units. */
  get numeratorUnits(): List<string>;

  /** This number's denominator units. */
  get denominatorUnits(): List<string>;

  /** Whether `this` has numerator or denominator units. */
  get hasUnits(): boolean;

  /**
   * If `value` is an integer according to Sass's numeric logic, returns the
   * corresponding JS integer, or throws an error if `value` isn't an integer.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of the parameter passed to the custom function (without the `$`).
   */
  assertInt(name?: string): number;

  /**
   * If `value` is between `min` and `max` according to Sass's numeric logic,
   * returns it clamped to that range. Otherwise, throws an error.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of the parameter passed to the custom function (without the `$`).
   */
  assertInRange(min: number, max: number, name?: string): number;

  /**
   * Returns `this` if it has no units. Otherwise, throws an error.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of a parameter passed to the custom function (without the `$`).
   */
  assertNoUnits(name?: string): SassNumber;

  /**
   * Returns `this` if it has `unit` as its single (numerator) unit. Otherwise,
   * throws an error.
   *
   * The `name` parameter is used for error reporting. It should match the name
   * of a parameter passed to the custom function (without the `$`).
   */
  assertUnit(name?: stringunit: string): SassNumber;

  /** Returns whether `this` has the single numerator unit `unit`. */
  hasUnit(unit: string): boolean;

  /** Returns whether this number's units are compatible with `unit`. */
  compatibleWithUnit(unit: string): boolean;

  /**
   * If this number's units are compatible with `newNumerators` and
   * `newDenominators`, returns a new number with those units that's equal to
   * `this`. Otherwise, throws an error.
   *
   * Note that unitless numbers are only compatible with other unitless numbers.
   */
  convert(
    newNumerators: string[] | List<string>,
    newDenominators: string[] | List<string>
  ): SassNumber;

  /**
   * If this number's units are compatible with `other`'s, returns a new number
   * with `other`'s units that's equal to `this`. Otherwise, throws an error.
   *
   * Note that unitless numbers are only compatible with other unitless numbers.
   */
  convertToMatch(other: SassNumber): SassNumber;

  /** Equivalent to `convert(newNumerators, newDenominators).value`. */
  convertValue(
    newNumerators: string[] | List<string>,
    newDenominators: string[] | List<string>
  ): number;

  /** Equivalent to `convertToMatch(other).value`. */
  convertValueToMatch(other: SassNumber): number;

  /**
   * Like `convert()`, but if `this` is unitless returns a copy of it with the
   * same value and the given units.
   */
  coerce(
    newNumerators: string[] | List<string>,
    newDenominators: string[] | List<string>
  ): SassNumber;

  /**
   * Like `convertToMatch()`, but if `this` is unitless returns a copy of it
   * with the same value and `other`'s units.
   */
  coerceToMatch(other: SassNumber): SassNumber;

  /** Equivalent to `coerce(newNumerators, newDenominators).value`. */
  coerceValue(
    newNumerators: string[] | List<string>,
    newDenominators: string[] | List<string>
  ): number;

  /** Equivalent to `coerceToMatch(other).value`. */
  coerceValueToMatch(other: SassNumber): number;
}
```

### Strings

The `SassString` class provides access to information about whether or not the
string is quoted. As with lists, JS's notion of indexes differs from Sass's, so
it also provides the `sassIndexToStringIndex()` method to convert a JS index
into a Sass index.

```ts
class SassString extends Value {
  /** Creates a string with the given `text`. */
  constructor(
    text: string,
    options?: {
      /** @default true */
      quotes: boolean;
    }
  );

  /** Creates an empty string`. */
  static empty(options?: {
    /** @default true */
    quotes: boolean;
  }): SassString;

  /** The contents of `this`. */
  get text(): string;

  /** Whether `this` has quotes. */
  get hasQuotes(): boolean;

  /** The number of Unicode code points in `text`. */
  get sassLength(): number;

  /**
   * Converts the Sass index `sassIndex` to a JS index into `text`.
   *
   * Sass indices start counting at 1, and may be negative in order to index
   * from the end of the list. In addition, Sass indexes strings by Unicode code
   * point, while JS indexes them by UTF-16 code unit.
   */
  sassIndexToStringIndex(sassIndex: Value): number;
}
```

### Lists

As mentioned above, most list functions are on the `Value` superclass to make it
easy to follow the Sass convention of treating all values as lists. However, the
`SassList` class can still be constructed to make new lists:

```ts
class SassList extends Value {
  /** Creates a Sass list with the given `contents`. */
  constructor(
    contents: Value[] | List<Value>,
    options?: {
      /** @default ',' */
      separator?: ListSeparator;
      /** @default false */
      brackets?: boolean;
    }
  );

  /** Creates an empty Sass list. */
  static empty(options?: {
    /** @default null */
    separator?: ListSeparator;
    /** @default false */
    brackets?: boolean;
  }): SassList;
}
```

### Maps

The `SassMap` class simply exposes its contents as an `OrderedMap` from the
[`immutable` package].

```ts
class SassMap extends Value {
  /** Creates a Sass map with the given `contents`. */
  constructor(contents: OrderedMap<Value, Value>);

  /** Creates an empty Sass map. */
  static empty(): SassMap;

  /** Returns this map's contents. */
  get contents(): OrderedMap<Value, Value>;
}
```

### Functions

The `SassFunction` class is fairly restrictive: it just allows a new first-class
function to be created with a synchronous callback. These functions can't be
invoked by custom functions—but they still provide more power than the old API!

```ts
class SassFunction extends Value {
  /**
   * Creates a Sass function value with the given `signature` that calls
   * `callback` when it's invoked.
   */
  constructor(
    signature: string,
    callback: CustomFunctionCallback
  );
}
```

## More Information

If you want to know more about these proposals and see their most up-to-date
forms, they're available on GitHub to view in full:

* [Compile API proposal](https://github.com/sass/sass/tree/main/proposal/new-js-api.d.ts)
* [Logger proposal](https://github.com/sass/sass/blob/main/proposal/js-logger.d.ts)
* [Importer proposal](https://github.com/sass/sass/blob/main/proposal/new-js-importer.d.ts)
* [Functions and values proposal](https://github.com/sass/sass/blob/main/proposal/new-function-and-values-api.d.ts)

We're eager for feedback, so please [let us know what you think]! The proposals
in question will be open for at least a month after this blog post goes live,
and possibly more depending on how lively the discussion around them is.

[let us know what you think]: https://github.com/sass/sass/issues/new
