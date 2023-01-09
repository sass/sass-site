// The old reference URL redirects to /documentation/, but it may have an anchor
// that refers to a more specific piece of documentation. If so, forward the
// user to that documentation.
if (window.location.hash) {
  if (window.location.pathname == '/documentation') {
    var redirects: Record<string, string> = {
      '#syntax': '/documentation/syntax',
      '#using_sass': '/install',
      '#rackrailsmerb_plugin': 'https://github.com/rails/sass-rails',
      '#caching': '/ruby-sass',
      '#options': '/ruby-sass',
      '#syntax_selection': '/documentation/syntax',
      '#encodings': '/documentation/syntax/parsing#input-encoding',
      '#css_extensions': '/documentation/style-rules',
      '#nested_rules': '/documentation/style-rules#nesting',
      '#parent-selector': '/documentation/style-rules/parent-selector',
      '#nested_properties': '/documentation/style-rules/declarations#nesting',
      '#placeholder_selectors_foo':
        '/documentation/style-rules/placeholder-selectors',
      '#comments': '/documentation/syntax/comments',
      '#sassscript': '/documentation/syntax/structure#expressions',
      '#interactive_shell': '/documentation/cli/dart-sass#interactive',
      '#variables_': '/documentation/variables',
      '#data_types': '/documentation/values',
      '#strings': '/documentation/values/strings',
      '#lists': '/documentation/values/lists',
      '#bracketed_lists': '/documentation/values/lists',
      '#maps': '/documentation/values/maps',
      '#colors': '/documentation/values/colors',
      '#first_class_functions': '/documentation/values/functions',
      '#operations': '/documentation/operators',
      '#number_operations': '/documentation/operators/numeric',
      '#division-and-slash':
        '/documentation/operators/numeric#slash-separated-values',
      '#subtraction': '/documentation/operators/numeric#unary-operators',
      '#color_operations': '/documentation/operators/color',
      '#string_operations': '/documentation/operators/string',
      '#boolean_operations': '/documentation/operators/boolean',
      '#list_operations': '/documentation/modules/list',
      '#parentheses': '/documentation/operators#parentheses',
      '#functions': '/documentation/modules',
      '#keyword_arguments':
        '/documentation/at-rules/function#keyword-arguments',
      '#interpolation_': '/documentation/interpolation',
      '#parent-script':
        '/documentation/style-rules/parent-selector#in-sassscript',
      '#variable_defaults_default': '/documentation/variables#default-values',
      '#directives': '/documentation/at-rules',
      '#import': '/documentation/at-rules/import',
      '#partials': '/documentation/at-rules/import#partials',
      '#index_files': '/documentation/at-rules/import#index-files',
      '#nested_import': '/documentation/at-rules/import#nesting',
      '#media': '/documentation/at-rules/css#media',
      '#extend': '/documentation/at-rules/extend',
      '#how_it_works': '/documentation/at-rules/extend#how-it-works',
      '#multiple_extends': '/documentation/at-rules/extend',
      '#chaining_extends': '/documentation/at-rules/extend',
      '#selector_sequences':
        '/documentation/at-rules/extend#disallowed-selectors',
      '#merging_selector_sequences':
        '/documentation/at-rules/extend#how-it-works',
      '#placeholders': '/documentation/at-rules/extend#placeholder-selectors',
      '#the_optional_flag':
        '/documentation/at-rules/extend#mandatory-and-optional-extends',
      '#extend_in_directives': '/documentation/at-rules/extend#extend-in-media',
      '#extending_compound_selectors':
        '/documentation/at-rules/extend#disallowed-selectors',
      '#at-root': '/documentation/at-rules/at-root',
      '#at-root_without__and_at-root_with_':
        '/documentation/at-rules/at-root#beyond-style-rules',
      '#debug': '/documentation/at-rules/debug',
      '#warn': '/documentation/at-rules/warn',
      '#error': '/documentation/at-rules/error',
      '#control_directives__expressions': '/documentation/at-rules/control',
      '#if': '/documentation/at-rules/control/if',
      '#for': '/documentation/at-rules/control/for',
      '#each': '/documentation/at-rules/control/each',
      '#each-multi-assign':
        '/documentation/at-rules/control/each#destructuring',
      '#while': '/documentation/at-rules/control/while',
      '#mixins': '/documentation/at-rules/mixin',
      '#defining_a_mixin': '/documentation/at-rules/mixin',
      '#including_a_mixin': '/documentation/at-rules/mixin',
      '#mixin-arguments': '/documentation/at-rules/mixin#arguments',
      '#trailing_commas': '/documentation/at-rules/mixin#arguments',
      '#variable_arguments':
        '/documentation/at-rules/mixin#taking-arbitrary-arguments',
      '#mixin-content': '/documentation/at-rules/mixin#content-blocks',
      '#variable_scope_and_content_blocks':
        '/documentation/at-rules/mixin#content-blocks',
      '#function_directives': '/documentation/at-rules/function',
      '#output_style': '/documentation/cli/dart-sass#style',
      '#expanded': '/documentation/cli/dart-sass#style',
      '#compressed': '/documentation/cli/dart-sass#style',
      '#nested': '/documentation/cli/ruby-sass#style',
      '#compact': '/documentation/cli/ruby-sass#style',
      '#extending_sass': '/documentation/js-api',
      '#defining_custom_sass_functions':
        '/documentation/js-api/interfaces/LegacySharedOptions#importer',
      '#cache_stores': '/ruby-sass',
      '#custom_importers':
        '/documentation/js-api/interfaces/LegacySharedOptions#functions',
    };

    var redirect: string | undefined = redirects[window.location.hash];

    // If the user is looking for a Ruby Sass option, redirect them to the Ruby
    // Sass page for an explanation that it's deprecated.
    if (!redirect && window.location.hash.match(/-option$/)) {
      redirect = '/ruby-sass';
    }

    if (redirect) window.location.href = redirect;
  } else if (window.location.pathname == '/documentation/modules') {
    var redirects: Record<string, string> = {
      '#declare-class_method': '/ruby-sass',
      '#random_number_generator-class_method': '/ruby-sass',
      '#random_seed=-class_method': '/ruby-sass',
      '#signature-class_method': '/ruby-sass',
      '#abs-instance_method': '/documentation/modules/math#abs',
      '#adjust_color-instance_method': '/documentation/modules/color#adjust',
      '#adjust_hue-instance_method': '/documentation/modules/color#adjust-hue',
      '#alpha-instance_method': '/documentation/modules/color#alpha',
      '#append-instance_method': '/documentation/modules/list#append',
      '#blue-instance_method': '/documentation/modules/color#blue',
      '#call-instance_method': '/documentation/modules/meta#call',
      '#ceil-instance_method': '/documentation/modules/math#ceil',
      '#change_color-instance_method': '/documentation/modules/color#change',
      '#comparable-instance_method': '/documentation/modules/math#compatible',
      '#complement-instance_method': '/documentation/modules/color#complement',
      '#content_exists-instance_method':
        '/documentation/modules/meta#content-exists',
      '#darken-instance_method': '/documentation/modules/color#darken',
      '#desaturate-instance_method': '/documentation/modules/color#desaturate',
      '#feature_exists-instance_method':
        '/documentation/modules/meta#feature-exists',
      '#floor-instance_method': '/documentation/modules/math#floor',
      '#get_function-instance_method':
        '/documentation/modules/meta#get-function',
      '#global_variable_exists-instance_method':
        '/documentation/modules/meta#global-variable-exists',
      '#grayscale-instance_method': '/documentation/modules/color#grayscale',
      '#green-instance_method': '/documentation/modules/color#green',
      '#hsl-instance_method': '/documentation/modules/color#hsl',
      '#hsla-instance_method': '/documentation/modules/color#hsla',
      '#hue-instance_method': '/documentation/modules/color#hue',
      '#ie_hex_str-instance_method': '/documentation/modules/color#ie-hex-str',
      '#if-instance_method': '/documentation/#if',
      '#index-instance_method': '/documentation/modules/list#index',
      '#inspect-instance_method': '/documentation/modules/meta#inspect',
      '#invert-instance_method': '/documentation/modules/color#invert',
      '#is_bracketed-instance_method':
        '/documentation/modules/list#is-bracketed',
      '#is_superselector-instance_method':
        '/documentation/modules/selector#is-superselector',
      '#join-instance_method': '/documentation/modules/list#join',
      '#keywords-instance_method': '/documentation/modules/meta#keywords',
      '#length-instance_method': '/documentation/modules/list#length',
      '#lighten-instance_method': '/documentation/modules/color#lighten',
      '#lightness-instance_method': '/documentation/modules/color#lightness',
      '#list_separator-instance_method':
        '/documentation/modules/list#separator',
      '#map_get-instance_method': '/documentation/modules/map#get',
      '#map_has_key-instance_method': '/documentation/modules/map#has-key',
      '#map_keys-instance_method': '/documentation/modules/map#keys',
      '#map_merge-instance_method': '/documentation/modules/map#merge',
      '#map_remove-instance_method': '/documentation/modules/map#remove',
      '#map_values-instance_method': '/documentation/modules/map#values',
      '#max-instance_method': '/documentation/modules/math#max',
      '#min-instance_method': '/documentation/modules/math#min',
      '#mix-instance_method': '/documentation/modules/color#mix',
      '#mixin_exists-instance_method':
        '/documentation/modules/meta#mixin-exists',
      '#nth-instance_method': '/documentation/modules/list#nth',
      '#opacify-instance_method': '/documentation/modules/color#opacify',
      '#opacity-instance_method': '/documentation/modules/color#opacity',
      '#percentage-instance_method': '/documentation/modules/math#percentage',
      '#quote-instance_method': '/documentation/modules/string#quote',
      '#random-instance_method': '/documentation/modules/math#random',
      '#red-instance_method': '/documentation/modules/color#red',
      '#rgb-instance_method': '/documentation/modules/color#rgb',
      '#rgba-instance_method': '/documentation/modules/color#rgba',
      '#round-instance_method': '/documentation/modules/math#round',
      '#saturate-instance_method': '/documentation/modules/color#saturate',
      '#saturation-instance_method': '/documentation/modules/color#saturation',
      '#scale_color-instance_method': '/documentation/modules/color#scale',
      '#selector_append-instance_method':
        '/documentation/modules/selector#append',
      '#selector_extend-instance_method':
        '/documentation/modules/selector#extend',
      '#selector_nest-instance_method': '/documentation/modules/selector#nest',
      '#selector_parse-instance_method':
        '/documentation/modules/selector#parse',
      '#selector_replace-instance_method':
        '/documentation/modules/selector#replace',
      '#selector_unify-instance_method':
        '/documentation/modules/selector#unify',
      '#set-instance_method': '/documentation/modules/list#set',
      '#simple_selectors-instance_method':
        '/documentation/modules/selector#simple-selectors',
      '#str_index-instance_method': '/documentation/modules/string#index',
      '#str_insert-instance_method': '/documentation/modules/string#insert',
      '#str_length-instance_method': '/documentation/modules/string#length',
      '#str_slice-instance_method': '/documentation/modules/string#slice',
      '#to_lower_case-instance_method':
        '/documentation/modules/string#to-lower-case',
      '#to_upper_case-instance_method':
        '/documentation/modules/string#to-upper-case',
      '#transparentize-instance_method':
        '/documentation/modules/color#transparentize',
      '#type_of-instance_method': '/documentation/modules/meta#type-of',
      '#unique_id-instance_method': '/documentation/modules/string#unique-id',
      '#unit-instance_method': '/documentation/modules/math#unit',
      '#unitless-instance_method': '/documentation/modules/math#is-unitless',
      '#unquote-instance_method': '/documentation/modules/string#unquote',
      '#variable_exists-instance_method':
        '/documentation/modules/meta#variable-exists',
      '#zip-instance_method': '/documentation/modules/list#zip',
    };

    var redirect: string | undefined = redirects[window.location.hash];
    if (redirect) window.location.href = redirect;
  } else if (window.location.pathname == '/documentation/modules/color') {
    var redirects: Record<string, string> = {
      '#rgb': '/documentation/modules#rgb',
      '#rgba': '/documentation/modules#rgba',
      '#hsl': '/documentation/modules#hsl',
      '#hsla': '/documentation/modules#hsla',
    };

    var redirect: string | undefined = redirects[window.location.hash];
    if (redirect) window.location.href = redirect;
  } else if (window.location.pathname == '/documentation/modules/map') {
    var redirects: Record<string, string> = {
      '#keywords': '/documentation/modules/meta#keywords',
    };

    var redirect: string | undefined = redirects[window.location.hash];
    if (redirect) window.location.href = redirect;
  } else if (window.location.pathname == '/documentation/at-rules/use') {
    var redirects: Record<string, string> = {
      '#configuring-modules': '/documentation/at-rules/use#configuration',
    };

    var redirect: string | undefined = redirects[window.location.hash];
    if (redirect) window.location.href = redirect;
  } else if (
    window.location.pathname == '/documentation/syntax/special-functions'
  ) {
    var redirects: Record<string, string> = {
      '#calc-clamp-element-progid-and-expression':
        '/documentation/syntax/special-functions#element-progid-and-expression',
      '#min-and-max': '/documentation/values/calculations#min-and-max',
    };

    var redirect: string | undefined = redirects[window.location.hash];
    if (redirect) window.location.href = redirect;
  } else if (window.location.pathname == '/documentation/js-api') {
    var redirects: Record<string, string> = {
      '#rendersync': '/documentation/js-api/modules#renderSync',
      '#render': '/documentation/js-api/modules#render',
      '#info': '/documentation/js-api/modules#info',
      '#result-css': '/documentation/js-api/interfaces/LegacyResult#css',
      '#result-map': '/documentation/js-api/interfaces/LegacyResult#map',
      '#result-stats-includedfiles':
        '/documentation/js-api/interfaces/LegacyResult#stats',
      '#result-stats-entry':
        '/documentation/js-api/interfaces/LegacyResult#stats',
      '#result-stats-start':
        '/documentation/js-api/interfaces/LegacyResult#stats',
      '#result-stats-end':
        '/documentation/js-api/interfaces/LegacyResult#stats',
      '#result-stats-duration':
        '/documentation/js-api/interfaces/LegacyResult#stats',
      '#error-object': '/documentation/js-api/interfaces/LegacyException',
      '#error-formatted':
        '/documentation/js-api/interfaces/LegacyException#formatted',
      '#error-file': '/documentation/js-api/interfaces/LegacyException#file',
      '#error-line': '/documentation/js-api/interfaces/LegacyException#line',
      '#error-column':
        '/documentation/js-api/interfaces/LegacyException#column',
      '#error-status':
        '/documentation/js-api/interfaces/LegacyException#status',
      '#options': '/documentation/js-api/interfaces/LegacySharedOptions',
      '#input':
        '/documentation/js-api/interfaces/LegacyFileOptions#includepaths',
      '#file': '/documentation/js-api/interfaces/LegacyFileOptions#file',
      '#data': '/documentation/js-api/interfaces/LegacyStringOptions#data',
      '#indentedsyntax':
        '/documentation/js-api/interfaces/LegacyStringOptions#indentedSyntax',
      '#includepaths':
        '/documentation/js-api/interfaces/LegacySharedOptions#includePaths',
      '#output': '/documentation/js-api/interfaces/LegacySharedOptions#charset',
      '#outputstyle':
        '/documentation/js-api/interfaces/LegacySharedOptions#outputStyle',
      '#charset':
        '/documentation/js-api/interfaces/LegacySharedOptions#charset',
      '#precision':
        '/documentation/js-api/interfaces/LegacySharedOptions#precision',
      '#indentType':
        '/documentation/js-api/interfaces/LegacySharedOptions#indentType',
      '#indentWidth':
        '/documentation/js-api/interfaces/LegacySharedOptions#indentWidth',
      '#linefeed':
        '/documentation/js-api/interfaces/LegacySharedOptions#linefeed',
      '#sourceComments':
        '/documentation/js-api/interfaces/LegacySharedOptions#sourceComments',
      '#source-maps':
        '/documentation/js-api/interfaces/LegacySharedOptions#sourceMap',
      '#sourcemap':
        '/documentation/js-api/interfaces/LegacySharedOptions#sourceMap',
      '#outfile':
        '/documentation/js-api/interfaces/LegacySharedOptions#outFile',
      '#omitsourcemapurl':
        '/documentation/js-api/interfaces/LegacySharedOptions#omitSourceMapUrl',
      '#sourcemapcontents':
        '/documentation/js-api/interfaces/LegacySharedOptions#sourceMapContents',
      '#sourcemapembed':
        '/documentation/js-api/interfaces/LegacySharedOptions#sourceMapEmbed',
      '#sourcemaproot':
        '/documentation/js-api/interfaces/LegacySharedOptions#sourceMapRoot',
      '#plugins': '/documentation/js-api/interfaces/LegacySharedOptions',
      '#fiber': '/blog/node-fibers-discontinued',
      '#functions':
        '/documentation/js-api/interfaces/LegacySharedOptions#functions',
      '#importer':
        '/documentation/js-api/interfaces/LegacySharedOptions#importer',
      '#other': '/documentation/js-api/interfaces/LegacySharedOptions',
      '#quietdeps':
        '/documentation/js-api/interfaces/LegacySharedOptions#quietDeps',
      '#verbose':
        '/documentation/js-api/interfaces/LegacySharedOptions#verbose',
      '#value-types': '/documentation/js-api/modules/types',
      '#types-number': '/documentation/js-api/classes/types.Number',
      '#new-types-number-value-unit':
        '/documentation/js-api/classes/types.Number#constructor',
      '#number-getvalue': '/documentation/js-api/classes/types.Number#getValue',
      '#number-getunit': '/documentation/js-api/classes/types.Number#getUnit',
      '#number-setvalue-value':
        '/documentation/js-api/classes/types.Number#setValue',
      '#number-setunit-unit':
        '/documentation/js-api/classes/types.Number#setUnit',
      '#types-string': '/documentation/js-api/classes/types.String',
      '#new-types-string-value':
        '/documentation/js-api/classes/types.String#constructor',
      '#string-getvalue': '/documentation/js-api/classes/types.String#getValue',
      '#string-setvalue-value':
        '/documentation/js-api/classes/types.String#setValue',
      '#types-color': '/documentation/js-api/classes/types.Color',
      '#new-types-color-red-green-blue-alpha-1':
        '/documentation/js-api/classes/types.Color#constructor',
      '#new-types-argb':
        '/documentation/js-api/classes/types.Color#constructor',
      '#color-getr': '/documentation/js-api/classes/types.Color#getR',
      '#color-getg': '/documentation/js-api/classes/types.Color#getG',
      '#color-getb': '/documentation/js-api/classes/types.Color#getB',
      '#color-geta': '/documentation/js-api/classes/types.Color#getA',
      '#color-setr-red': '/documentation/js-api/classes/types.Color#setR',
      '#color-setg-green': '/documentation/js-api/classes/types.Color#setG',
      '#color-setb-blue': '/documentation/js-api/classes/types.Color#setB',
      '#color-seta-alpha': '/documentation/js-api/classes/types.Color#setA',
      '#types-boolean': '/documentation/js-api/classes/types.Boolean',
      '#types-boolean-true': '/documentation/js-api/classes/types.Boolean#TRUE',
      '#types-boolean-false':
        '/documentation/js-api/classes/types.Boolean#FALSE',
      '#types-boolean-getvalue':
        '/documentation/js-api/classes/types.Boolean#getValue',
      '#types-list': '/documentation/js-api/classes/types.List',
      '#new-types-list-length-comma-true':
        '/documentation/js-api/classes/types.List#constructor',
      '#list-getvalue-index':
        '/documentation/js-api/classes/types.List#getValue',
      '#list-getseparator':
        '/documentation/js-api/classes/types.List#getSeparator',
      '#list-getlength': '/documentation/js-api/classes/types.List#getLength',
      '#list-setvalue-index-value':
        '/documentation/js-api/classes/types.List#setValue',
      '#list-setseparator-comma':
        '/documentation/js-api/classes/types.List#setSeparator',
      '#types-map': '/documentation/js-api/classes/types.Map',
      '#new-types-map-length':
        '/documentation/js-api/classes/types.Map#constructor',
      '#map-getkey-index': '/documentation/js-api/classes/types.Map#getKey',
      '#map-getvalue-index': '/documentation/js-api/classes/types.Map#getValue',
      '#map-getlength': '/documentation/js-api/classes/types.Map#getLength',
      '#map-setkey-index-key': '/documentation/js-api/classes/types.Map#setKey',
      '#map-setvalue-index-value':
        '/documentation/js-api/classes/types.Map#setValue',
      '#types-null': '/documentation/js-api/classes/types.Null',
      '#types-null-null': '/documentation/js-api/classes/types.Null#NULL',
    };

    var redirect: string | undefined = redirects[window.location.hash];
    if (redirect) window.location.href = redirect;
  }
}
