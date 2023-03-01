---
title: Cleaning Up Interpolation
author: Natalie Weizenbaum
# date: 2015-12-09 15:20 PST
---

Interpolation—the ability to add variables and other snippets using `#{...}`—is
one of the handiest all-purpose features of Sass. You can use it just about
everywhere you might need to inject a variable, a function call, or some other
expression. In most of those places it just plops the value into the surrounding
text. It's straightforward, easy to understand, and useful, which is exactly
what we want from a feature.

Unfortunately, that's only true in *most places*. For complicated historical
reasons, there's one place where interpolation goes a little bit bananas: inside
an expression but outside quotes. Most of the time, it makes sense; if you write
`display: -#{$prefix}-box`, you'll get what you expect. But if any operators
like `+` are used next to the interpolation, you start to get weird output. For
example, `$name + #{$counter + 1}` might return an unquoted string containing
the text `name + 3`.

This is really weird behavior. Why does `+` behave differently here than it does
everywhere else? Why is it treated as plain text when `$name` gets evaluated
normally? This behavior is confusing, inconsistent, and not particularly useful,
which are very much *not* things we want in a feature. So why do they exist in
the first place?

## Complicated Historical Reasons

*If you don't care for a history lesson, skip on down to [A Brave New
World](#a-brave-new-world).*

Way back in the dawn of time, when the indented syntax was the only syntax, Sass
had a distinction between "static" and "dynamic" properties. A static property
was basically plain CSS; it was declared using `property: value`, and the value
was used as-is without any further processing. If you wanted to use a variable
or a function, you had to use a dynamic property, which was declared using
`property= value`. A You'd see a lot of stylesheets like this:

```sass
.border
  border-width: 4px
  border-style: solid
  border-color= !background_color
```

Also, in the dawn of time, variables used `!` instead of `$` and couldn't
include hyphens. The dawn of time kind of sucked. But it was in this context
that we first added interpolation. We wanted to allow properties like `border`
with multiple values to be partially dynamic, so we decided to follow in Ruby's
footsteps and allow `#{}` to be used to drop in values. Soon stylesheets started
looking like this:

```sass
.border
  border: 4px solid #{!background_color}
```

That's so much better! And for a while, all was calm.

### Then Came SCSS

It eventually became clear that users really strongly wanted their stylesheets
to look like CSS, so we sat down and started work on the syntax that would
become SCSS in the release that would become Sass 3. As part of this work, we
decided to get rid of the distinction between static and dynamic properties
altogether. Having all properties work the same way was obviously great for
users, but it meant we had to figure out how to merge the two syntaxes with a
minimum of pain.

This was mostly straightforward, since the old expression syntax was pretty much
universally invalid CSS or something that emitted its CSS value anyway. But
interpolation proved tricky. Backwards compatibility is really important to us,
so we wanted to be sure that all the places interpolation was used—or *could
theoretically be used*—in Sass 2 would continue to work in Sass 3, even though
everything around them was now fully parsed.

Our solution was to make basically anything around `#{}` that wasn't obviously
part of a plain-CSS expression turn into a string. That way, hopefully any weird
corner cases that people had would keep working when they upgraded. This led to
the weird behavior I described above, but at the time our top priority was
making it as easy as possible for users to migrate to Sass 3. We decided the
weirdness was worth it, and shipped it.

## A Brave New World

Flash forward to today. We're now starting work on the next major release, Sass
4, and (I dearly hope) no one's written any Sass 2 stylesheets in years. A major
release is a great opportunity to clean up this bit of historical cruft, and
after [discussing it extensively on the issue
tracker](https://github.com/sass/sass/issues/1778) we decided to make the
change.

There are three major steps in a backwards-incompatible change like this. The
first is to design the new syntax, which was pretty easy here, since it's
basically just "do what everyone thought it did already." We just had to take
that general notion and suss out the specifics.

We ended up framing it as `#{}` being, syntactically, part of an identifier.
When you write `-#{$prefix}-box`, Sass parses it as a single identifier
containing `"-"` followed by the value of `$prefix` followed by `"-box"`. Even
if you write `#{$font}` all on its own, it's parsed as an identifier that only
contains the value of `$font`. This way, interpolation doesn't have weird
behavior around operators any more than identifiers ever did.

Once we had a design, the second step was to deprecate the old behavior. The
meat of deprecation is figuring out when to print a warning, and that was pretty
tough here. We didn't want to warn for situations that would continue to work,
even when they involved operators—for example, `12px/#{$line-height}` will print
the right thing in the old and new worlds (although for slightly different
reasons), but `12px+#{$line-height}` won't.

I won't go into the gory details of how we got deprecation working here; that's
what the [GitHub issue](https://github.com/sass/sass/issues/1778) is for.
Suffice it to say that it involved a lot of special cases, including some where
a deprecation warning can be printed based on how a value is *used* rather than
how it's *written*. I'm pretty happy with where it ended up, though; I suspect
it'll catch 99% of cases that will actually break in practice.

Another exciting bonus was the ability to automatically update code. This
doesn't always work when introducing backwards-incompatibilities, but in this
case we were able to make `sass-convert` convert deprecated uses of
interpolation into Sass 4-compatible code. It has some false negatives—it only
converts cases it can prove will be incompatible—but it's enough to get users a
long way there.

The final step once the deprecation was in place was to move to [the `main`
branch](https://github.com/sass/sass/commits/main) (which will eventually
become Sass 4), rip out all the old behavior, and implement the new. And it was
*wonderful*. Deleting gross code and replacing it with something clean feels
like taking a shower after spending a day hiking through dust under a hot sun.
And after working on this feature for weeks, I was happy to see the other end of
it.

## Checking it Out

Sass 3.4.20, released today, was the first release to include the deprecation
warnings for the old syntax. If you want to check whether you've got any
deprecated interpolations lurking in your stylesheets, just `gem install sass`
and recompile your stylesheet. And if you do find some, try running
`sass-convert --recursive --in-place .` to fix a bunch automatically.

If you want to try out the new syntax, 4.0.0.alpha.1 was also released today.
You can get it with `gem install sass --prerelease`. But beware: it is alpha
software, so it may change in the future. We generally try to keep even our
prereleases pretty stable, but there's also a chance you'll run into a bug.

If you do find a bug, please file it on [the issue
tracker](https://github.com/sass/sass/issues). Even if it's something as simple
as a typo, we want to know. If we've deprecated something that should be valid,
we *especially* want to know. And if you just have a question, feel free to
tweet at [@SassCSS](https://twitter.com/SassCSS) or post it on the [mailing
list](https://groups.google.com/forum/#!forum/sass-lang).
