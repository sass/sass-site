---
title: sass:map
---

{% render 'doc_snippets/built-in-module-status' %}

{% funFact %}
  Sass libraries and design systems tend to share and override configurations
  that are represented as nested maps (maps that contain maps that contain
  maps).

  To help you work with nested maps, some map functions support deep operations.
  For example, if you pass multiple keys to `map.get()`, it will follow those
  keys to find the desired nested map:

  {% codeExample 'map' %}
    @use "sass:map";

    $config: (a: (b: (c: d)));
    @debug map.get($config, a, b, c); // d
    ===
    @use "sass:map"

    $config: (a: (b: (c: d)))
    @debug map.get($config, a, b, c) // d
  {% endcodeExample %}
{% endfunFact %}

{% function 'map.deep-merge($map1, $map2)', 'returns:map' %}
  {% compatibility 'dart: "1.27.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Identical to [`map.merge()`](#merge), except that nested map values are *also*
  recursively merged.

  {% codeExample 'map-deep-merge' %}
    @use "sass:map";

    $helvetica-light: (
      "weights": (
        "lightest": 100,
        "light": 300
      )
    );
    $helvetica-heavy: (
      "weights": (
        "medium": 500,
        "bold": 700
      )
    );

    @debug map.deep-merge($helvetica-light, $helvetica-heavy);
    // (
    //   "weights": (
    //     "lightest": 100,
    //     "light": 300,
    //     "medium": 500,
    //     "bold": 700
    //   )
    // )
    @debug map.merge($helvetica-light, $helvetica-heavy);
    // (
    //   "weights": (
    //     "medium: 500,
    //     "bold": 700
    //   )
    // )
    ===
    @use "sass:map"

    $helvetica-light: ("weights": ("lightest": 100, "light": 300))
    $helvetica-heavy: ("weights": ("medium": 500, "bold": 700))

    @debug map.deep-merge($helvetica-light, $helvetica-heavy)
    // (
    //   "weights": (
    //     "lightest": 100,
    //     "light": 300,
    //     "medium": 500,
    //     "bold": 700
    //   )
    // )
    @debug map.merge($helvetica-light, $helvetica-heavy);
    // (
    //   "weights": (
    //     "medium: 500,
    //     "bold": 700
    //   )
    // )
  {% endcodeExample %}
{% endfunction %}

{% function 'map.deep-remove($map, $key, $keys...)', 'returns:map' %}
  {% compatibility 'dart: "1.27.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  If `$keys` is empty, returns a copy of `$map` without a value associated with
  `$key`.

  {% codeExample 'map-deep-remove' %}
    @use "sass:map";

    $font-weights: ("regular": 400, "medium": 500, "bold": 700);

    @debug map.deep-remove($font-weights, "regular");
    // ("medium": 500, "bold": 700)
    ===
    @use "sass:map"

    $font-weights: ("regular": 400, "medium": 500, "bold": 700)

    @debug map.deep-remove($font-weights, "regular")
    // ("medium": 500, "bold": 700)
  {% endcodeExample %}

  ---

  If `$keys` is not empty, follows the set of keys including `$key` and
  excluding the last key in `$keys`, from left to right, to find the nested map
  targeted for updating.

  Returns a copy of `$map` where the targeted map does not have a value
  associated with the last key in `$keys`.

  {% codeExample 'map-deep-remove-2' %}
    @use "sass:map";

    $fonts: (
      "Helvetica": (
        "weights": (
          "regular": 400,
          "medium": 500,
          "bold": 700
        )
      )
    );

    @debug map.deep-remove($fonts, "Helvetica", "weights", "regular");
    // (
    //   "Helvetica": (
    //     "weights: (
    //       "medium": 500,
    //       "bold": 700
    //     )
    //   )
    // )
    ===
    @use "sass:map"

    $fonts: ("Helvetica": ("weights": ("regular": 400, "medium": 500, "bold": 700)))

    @debug map.deep-remove($fonts, "Helvetica", "weights", "regular")
    // (
    //   "Helvetica": (
    //     "weights: (
    //       "medium": 500,
    //       "bold": 700
    //     )
    //   )
    // )
  {% endcodeExample %}
{% endfunction %}

{% function 'map.get($map, $key, $keys...)', 'map-get($map, $key, $keys...)' %}
  If `$keys` is empty, returns the value in `$map` associated with `$key`.

  If `$map` doesn't have a value associated with `$key`, returns [`null`][].

  [`null`]: /documentation/values/null

  {% render 'code_snippets/example-map-get' %}

  ---

  {% compatibility 'dart: "1.27.0"', 'libsass: false', 'ruby: false' %}
    Only Dart Sass supports calling `map.get()` with more than two arguments.
  {% endcompatibility %}

  If `$keys` is not empty, follows the set of keys including `$key` and
  excluding the last key in `$keys`, from left to right, to find the nested map
  targeted for searching.

  Returns the value in the targeted map associated with the last key in `$keys`.

  Returns [`null`][] if the map does not have a value associated with the key,
  or if any key in `$keys` is missing from a map or references a value that is
  not a map.

  [`null`]: /documentation/values/null

  {% codeExample 'map-deep-remove-2' %}
    @use "sass:map";

    $fonts: (
      "Helvetica": (
        "weights": (
          "regular": 400,
          "medium": 500,
          "bold": 700
        )
      )
    );

    @debug map.get($fonts, "Helvetica", "weights", "regular"); // 400
    @debug map.get($fonts, "Helvetica", "colors"); // null
    ===
    @use "sass:map"

    $fonts: ("Helvetica": ("weights": ("regular": 400, "medium": 500, "bold": 700)))

    @debug map.get($fonts, "Helvetica", "weights", "regular") // 400
    @debug map.get($fonts, "Helvetica", "colors") // null
  {% endcodeExample %}
{% endfunction %}

{% function 'map.has-key($map, $key, $keys...)', 'map-has-key($map, $key, $keys...)', 'returns:boolean' %}
  If `$keys` is empty, returns whether `$map` contains a value associated with
  `$key`.

  {% codeExample 'map-has-key' %}
    @use "sass:map";

    $font-weights: ("regular": 400, "medium": 500, "bold": 700);

    @debug map.has-key($font-weights, "regular"); // true
    @debug map.has-key($font-weights, "bolder"); // false
    ===
    @use "sass:map"

    $font-weights: ("regular": 400, "medium": 500, "bold": 700)

    @debug map.has-key($font-weights, "regular") // true
    @debug map.has-key($font-weights, "bolder") // false
  {% endcodeExample %}

  ---

  {% compatibility 'dart: "1.27.0"', 'libsass: false', 'ruby: false' %}
    Only Dart Sass supports calling `map.has-key()` with more than two
    arguments.
  {% endcompatibility %}

  If `$keys` is not empty, follows the set of keys including `$key` and
  excluding the last key in `$keys`, from left to right, to find the nested map
  targeted for searching.

  Returns true if the targeted map contains a value associated with the last key
  in `$keys`.

  Returns false if it does not, or if any key in `$keys` is missing from a map
  or references a value that is not a map.

  {% codeExample 'map-has-key-2' %}
    @use "sass:map";

    $fonts: (
      "Helvetica": (
        "weights": (
          "regular": 400,
          "medium": 500,
          "bold": 700
        )
      )
    );

    @debug map.has-key($fonts, "Helvetica", "weights", "regular"); // true
    @debug map.has-key($fonts, "Helvetica", "colors"); // false
    ===
    @use "sass:map"

    $fonts: ("Helvetica": ("weights": ("regular": 400, "medium": 500, "bold": 700)))

    @debug map.has-key($fonts, "Helvetica", "weights", "regular") // true
    @debug map.has-key($fonts, "Helvetica", "colors") // false
  {% endcodeExample %}
{% endfunction %}

{% function 'map.keys($map)', 'map-keys($map)', 'returns:list' %}
  Returns a comma-separated list of all the keys in `$map`.

  {% codeExample 'map-keys' %}
    @use "sass:map";

    $font-weights: ("regular": 400, "medium": 500, "bold": 700);

    @debug map.keys($font-weights); // "regular", "medium", "bold"
    ===
    @use "sass:map"

    $font-weights: ("regular": 400, "medium": 500, "bold": 700)

    @debug map.keys($font-weights)  // "regular", "medium", "bold"
  {% endcodeExample %}
{% endfunction %}

{% function 'map.merge($map1, $map2)', 'map-merge($map1, $map2)', 'map.merge($map1, $keys..., $map2)', 'map-merge($map1, $keys..., $map2)', 'returns:map' %}
  {% headsUp %}
    In practice, the actual arguments to `map.merge($map1, $keys..., $map2)` are
    passed as `map.merge($map1, $args...)`. They are described here as `$map1,
    $keys..., $map2` for explanation purposes only.
  {% endheadsUp %}

  If no `$keys` are passed, returns a new map with all the keys and values from
  both `$map1` and `$map2`.

  If both `$map1` and `$map2` have the same key, `$map2`'s value takes
  precedence.

  All keys in the returned map that also appear in `$map1` have the same order
  as in `$map1`. New keys from `$map2` appear at the end of the map.

  {% codeExample 'map-merge' %}
    @use "sass:map";

    $light-weights: ("lightest": 100, "light": 300);
    $heavy-weights: ("medium": 500, "bold": 700);

    @debug map.merge($light-weights, $heavy-weights);
    // ("lightest": 100, "light": 300, "medium": 500, "bold": 700)
    ===
    @use "sass:map"

    $light-weights: ("lightest": 100, "light": 300)
    $heavy-weights: ("medium": 500, "bold": 700)

    @debug map.merge($light-weights, $heavy-weights)
    // ("lightest": 100, "light": 300, "medium": 500, "bold": 700)
  {% endcodeExample %}

  ---

  {% compatibility 'dart: "1.27.0"', 'libsass: false', 'ruby: false' %}
    Only Dart Sass supports calling `map.merge()` with more than two arguments.
  {% endcompatibility %}

  If `$keys` is not empty, follows the `$keys` to find the nested map targeted
  for merging. If any key in `$keys` is missing from a map or references a value
  that is not a map, sets the value at that key to an empty map.

  Returns a copy of `$map1` where the targeted map is replaced by a new map that
  contains all the keys and values from both the targeted map and `$map2`.

  {% codeExample 'map-merge-2' %}
    @use "sass:map";

    $fonts: (
      "Helvetica": (
        "weights": (
          "lightest": 100,
          "light": 300
        )
      )
    );
    $heavy-weights: ("medium": 500, "bold": 700);

    @debug map.merge($fonts, "Helvetica", "weights", $heavy-weights);
    // (
    //   "Helvetica": (
    //     "weights": (
    //       "lightest": 100,
    //       "light": 300,
    //       "medium": 500,
    //       "bold": 700
    //     )
    //   )
    // )
    ===
    @use "sass:map"

    $fonts: ("Helvetica": ("weights": ("lightest": 100, "light": 300)))
    $heavy-weights: ("medium": 500, "bold": 700)

    @debug map.merge($fonts, "Helvetica", "weights", $heavy-weights)
    // (
    //   "Helvetica": (
    //     "weights": (
    //       "lightest": 100,
    //       "light": 300,
    //       "medium": 500,
    //       "bold": 700
    //     )
    //   )
    // )
  {% endcodeExample %}
{% endfunction %}

{% function 'map.remove($map, $keys...)', 'map-remove($map, $keys...)', 'returns:map' %}
  Returns a copy of `$map` without any values associated with `$keys`.

  If a key in `$keys` doesn't have an associated value in `$map`, it's ignored.

  {% codeExample 'map-remove' %}
    @use "sass:map";

    $font-weights: ("regular": 400, "medium": 500, "bold": 700);

    @debug map.remove($font-weights, "regular"); // ("medium": 500, "bold": 700)
    @debug map.remove($font-weights, "regular", "bold"); // ("medium": 500)
    @debug map.remove($font-weights, "bolder");
    // ("regular": 400, "medium": 500, "bold": 700)
    ===
    @use "sass:map"

    $font-weights: ("regular": 400, "medium": 500, "bold": 700)

    @debug map.remove($font-weights, "regular")  // ("medium": 500, "bold": 700)
    @debug map.remove($font-weights, "regular", "bold")  // ("medium": 500)
    @debug map.remove($font-weights, "bolder")
    // ("regular": 400, "medium": 500, "bold": 700)
  {% endcodeExample %}
{% endfunction %}

{% function 'map.set($map, $key, $value)', 'map.set($map, $keys..., $key, $value)', 'returns:map' %}
  {% headsUp %}
    In practice, the actual arguments to `map.set($map, $keys..., $key, $value)`
    are passed as `map.set($map, $args...)`. They are described here as `$map,
    $keys..., $key, $value` for explanation purposes only.
  {% endheadsUp %}

  If `$keys` are not passed, returns a copy of `$map` with the value at `$key`
  set to `$value`.

  {% codeExample 'map-set' %}
    @use "sass:map";

    $font-weights: ("regular": 400, "medium": 500, "bold": 700);

    @debug map.set($font-weights, "regular", 300);
    // ("regular": 300, "medium": 500, "bold": 700)
    ===
    @use "sass:map"

    $font-weights: ("regular": 400, "medium": 500, "bold": 700)

    @debug map.set($font-weights, "regular", 300)
    // ("regular": 300, "medium": 500, "bold": 700)
  {% endcodeExample %}

  ---

  {% compatibility 'dart: "1.27.0"', 'libsass: false', 'ruby: false' %}
    Only Dart Sass supports calling `map.set()` with more than three arguments.
  {% endcompatibility %}

  If `$keys` are passed, follows the `$keys` to find the nested map targeted for
  updating. If any key in `$keys` is missing from a map or references a value
  that is not a map, sets the value at that key to an empty map.

  Returns a copy of `$map` with the targeted map's value at `$key` set to
  `$value`.

  {% codeExample 'map-set-2' %}
    @use "sass:map";

    $fonts: (
      "Helvetica": (
        "weights": (
          "regular": 400,
          "medium": 500,
          "bold": 700
        )
      )
    );

    @debug map.set($fonts, "Helvetica", "weights", "regular", 300);
    // (
    //   "Helvetica": (
    //     "weights": (
    //       "regular": 300,
    //       "medium": 500,
    //       "bold": 700
    //     )
    //   )
    // )
    ===
    @use "sass:map"

    $fonts: ("Helvetica": ("weights": ("regular": 400, "medium": 500, "bold": 700)))

    @debug map.set($fonts, "Helvetica", "weights", "regular", 300)
    // (
    //   "Helvetica": (
    //     "weights": (
    //       "regular": 300,
    //       "medium": 500,
    //       "bold": 700
    //     )
    //   )
    // )
  {% endcodeExample %}
{% endfunction %}

{% function 'map.values($map)', 'map-values($map)', 'returns:list' %}
  Returns a comma-separated list of all the values in `$map`.

  {% codeExample 'map-values' %}
    @use "sass:map";

    $font-weights: ("regular": 400, "medium": 500, "bold": 700);

    @debug map.values($font-weights); // 400, 500, 700
    ===
    @use "sass:map"

    $font-weights: ("regular": 400, "medium": 500, "bold": 700)

    @debug map.values($font-weights)  // 400, 500, 700
  {% endcodeExample %}
{% endfunction %}
