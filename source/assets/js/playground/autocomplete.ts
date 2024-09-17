import {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from '@codemirror/autocomplete';
import {sassCompletionSource} from '@codemirror/lang-sass';
import {syntaxTree} from '@codemirror/language';
import {EditorState} from '@codemirror/state';
import moduleMetadata from './module-metadata';

// The validFor identifier, from @codemirror/lang-css. After an initial set of
// possible completions are returned from a completion soruce, the matched set
// narrows as the user types as long as it matches this identifier. Once it no
// longer matches, the completion sources are checked again.
// https://codemirror.net/docs/ref/#autocomplete.CompletionResult.validFor
const identifier = /^(\w[\w-]*|-\w[\w-]*|)$/;

// Sass-specific at rules only. CSS at rules should be added to `@codemirror/lang-css`.
const atRuleKeywords = [
  'use',
  'forward',
  'import',
  'mixin',
  'include',
  'function',
  'extend',
  'error',
  'warn',
  'debug',
  'at-root',
  'if',
  'else',
  'each',
  'for',
  'while',
];

// CompletionResult options for Sass at rules, for example `@use`.
const atRuleOptions = Object.freeze(
  atRuleKeywords.map(keyword => ({
    label: `@${keyword} `,
    type: 'keyword',
    validFor: identifier,
  }))
);

// Completions for Sass at rules
function atRuleCompletion(context: CompletionContext): CompletionResult | null {
  const atRule = context.matchBefore(/@\w*/);
  if (!atRule) return null;
  if (atRule.from === atRule.to && !context.explicit) return null;
  return {
    from: atRule.from,
    to: atRule.to,
    options: atRuleOptions,
    validFor: identifier,
  };
}

// A list of all the Sass built in modules.
const moduleNames = moduleMetadata.map(mod => mod.name);
type ModuleName = (typeof moduleNames)[number];

// Matches an identifier namespaced within any of the built in Sass modules.
const moduleNameRegExp = new RegExp(`(${moduleNames.join('|')}).\\$?\\w*`);

// Matches the StringLiteral `"sass:modName"`, capturing `modName`.
const moduleUseRegex = new RegExp(/['"]sass:(?<modName>.*)['"]/);

// Completion results for built in Sass modules following the `sass:` namespace.
const moduleCompletions = Object.freeze(
  moduleMetadata.map(mod => ({
    label: `sass:${mod.name}`,
    apply: `sass:${mod.name}`,
    info: mod.description,
    type: 'class',
    validFor: identifier,
    _moduleName: mod.name as ModuleName,
  }))
);

// Completions for the import of built in modules, for instance "sass:color".
function moduleMetadataCompletion(
  context: CompletionContext
): CompletionResult | null {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  const potentialTypes = [
    'StringLiteral', // When wrapped in quotes- `"sass:"`
    'ValueName', // No end quote, before semicolon- `"sa`
    ':', // No end quote, on semicolon- `"sass:`
    'PseudoClassName', // No end quote, after semicolon- `"sass:m`
  ];
  if (!potentialTypes.includes(nodeBefore.type.name)) return null;
  const potentialParentTypes = [
    'UseStatement', // When wrapped in quotes
    'PseudoClassSelector', // No end quote, after the colon
  ];
  if (!potentialParentTypes.includes(nodeBefore.parent?.type.name || '')) {
    return null;
  }

  const moduleMatch = context.matchBefore(/["'](sass:)?\w*/);

  if (!moduleMatch) return null;
  if (moduleMatch.from === moduleMatch.to && !context.explicit) return null;

  const included = includedModuleMetadata(context.state);
  const notIncludedModuleCompletions = moduleCompletions.filter(
    moduleCompletion => !included.includes(moduleCompletion._moduleName)
  );
  return {
    from: moduleMatch.from + 1,
    to: moduleMatch.to,
    options: notIncludedModuleCompletions,
    validFor: identifier,
  };
}
/**
 * Maps modules into a record with the name as the key and the result of `map`
 * as the value.
 */
function mapModulesByName<V>(
  map: (module: (typeof moduleMetadata)[number]) => V
): Record<ModuleName, V> {
  return moduleMetadata.reduce<Record<string, V>>((acc, mod) => {
    acc[mod.name] = map(mod);
    return acc;
  }, {});
}

// Completion results for module variables.
const moduleVariableCompletions = Object.freeze(
  mapModulesByName(
    mod =>
      mod.variables.map(variable => ({
        label: `${mod.name}.${variable}`,
        type: 'variable',
      })) || []
  )
);

// Completion results for module functions.
const moduleFunctionsCompletions = Object.freeze(
  mapModulesByName(
    mod =>
      mod.functions.map(func => ({
        label: `${mod.name}.${func}`,
        apply: `${mod.name}.${func}(`,
        type: 'method',
        boost: 10,
        validFor: identifier,
      })) || []
  )
);

// Type predicate for modules names.
function isModuleName(string?: string | null): string is ModuleName {
  return moduleNames.includes(string as ModuleName);
}

// Returns the list of built in modules that are included in the text.
function includedModuleMetadata(state: EditorState): ModuleName[] {
  const tree = syntaxTree(state);
  const useNodes = tree.topNode.getChildren('UseStatement');
  const usedModules = useNodes.map(useNode => {
    const cursor = useNode.cursor();
    while (cursor.next()) {
      if (cursor.node.name === 'StringLiteral') {
        const string = state.doc.sliceString(cursor.from, cursor.to);
        return string.match(moduleUseRegex)?.groups?.modName;
      }
    }
    return null;
  });

  return usedModules.filter<ModuleName>(mod => isModuleName(mod));
}

// Completions for the namespaces of included built in modules.
function builtinModuleNameCompletion(
  context: CompletionContext
): CompletionResult | null {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (nodeBefore.type.name !== 'ValueName') return null;
  // Prevent module name from showing up after `.`
  if (nodeBefore.parent?.type.name === 'NamespacedValue') return null;
  const includedModules = includedModuleMetadata(context.state);

  const match = context.matchBefore(/\w+/);
  if (!match) return null;

  return {
    from: match.from,
    to: match.to,
    options: includedModules.map(mod => ({
      label: mod,
      info: moduleMetadata.find(builtin => builtin.name === mod)?.description,
      type: 'namespace',
      boost: 20,
      validFor: identifier,
    })),
  };
}

// Completions for variables and functions for included built in modules.
function builtinModuleItemCompletion(
  context: CompletionContext
): CompletionResult | null {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (
    ![nodeBefore.type.name, nodeBefore.parent?.type.name].includes(
      'NamespacedValue'
    )
  ) {
    return null;
  }
  const moduleNameMatch = context.matchBefore(moduleNameRegExp);

  if (!moduleNameMatch) return null;
  if (moduleNameMatch.from === moduleNameMatch.to && !context.explicit) {
    return null;
  }

  const includedModules = includedModuleMetadata(context.state);

  const includedModFunctions = includedModules.flatMap(
    mod => moduleFunctionsCompletions[mod]
  );
  const includedModVariables = includedModules.flatMap(
    mod => moduleVariableCompletions[mod]
  );

  return {
    from: moduleNameMatch.from,
    to: moduleNameMatch.to,
    options: [...includedModVariables, ...includedModFunctions],
    validFor: identifier,
  };
}

// Aggregates all custom completions with the CodeMirror sassCompletionSource.
const playgroundCompletions: CompletionSource[] = [
  atRuleCompletion,
  moduleMetadataCompletion,
  builtinModuleNameCompletion,
  sassCompletionSource,
  builtinModuleItemCompletion,
];

export default playgroundCompletions;
