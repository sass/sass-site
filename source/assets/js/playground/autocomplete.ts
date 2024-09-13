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

interface CompletionInfo {
  name: string;
  description?: string;
}

interface CompletionModule extends CompletionInfo {
  functions: CompletionInfo[];
  variables?: CompletionInfo[];
}

const moduleNames = moduleMetadata.map(mod => mod.name);
type ModuleName = (typeof moduleNames)[number];

const builtinModules: CompletionModule[] = moduleMetadata.map(modMember => {
  let variables;
  if ('variables' in modMember) {
    variables = modMember.variables;
  }
  return {
    name: modMember.name,
    description: modMember.description,
    functions: (modMember.functions ?? []).map(name => ({name})),
    variables: (variables ?? []).map(name => ({name: `$${name}`})),
  };
});

const moduleNameRegExp = new RegExp(`(${moduleNames.join('|')}).\\$?\\w*`);

const moduleCompletions = Object.freeze(
  builtinModules.map(mod => ({
    label: `sass:${mod.name}`,
    apply: `sass:${mod.name}`,
    info: mod.description,
    type: 'class',
    validFor: identifier,
  }))
);

// Completions for the import of built in modules, for instance "sass:color".
function builtinModulesCompletion(
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
  return {
    from: moduleMatch.from + 1,
    to: moduleMatch.to,
    options: moduleCompletions,
    validFor: identifier,
  };
}

const moduleVariableCompletions = Object.freeze(
  builtinModules.reduce(
    (acc: {[k: string]: CompletionResult['options'] | []}, mod) => {
      acc[mod.name] =
        mod.variables?.map(variable => ({
          label: `${mod.name}.${variable.name}`,
          type: 'variable',
        })) || [];
      return acc;
    },
    {}
  )
);

const moduleFunctionsCompletions = Object.freeze(
  builtinModules.reduce(
    (acc: {[k: string]: CompletionResult['options'] | []}, mod) => {
      acc[mod.name] =
        mod.functions.map(variable => ({
          label: `${mod.name}.${variable.name}`,
          apply: `${mod.name}.${variable.name}(`,
          type: 'method',
          boost: 10,
          validFor: identifier,
        })) || [];
      return acc;
    },
    {}
  )
);

// Returns the list of built in modules that are included in the text.
function includedBuiltinModules(state: EditorState): ModuleName[] {
  const text = state.doc.toString();
  return moduleNames.filter(name => text.includes(`sass:${name}`));
}

// Completions for the namespaces of included built in modules.
function builtinModuleNameCompletion(
  context: CompletionContext
): CompletionResult | null {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (nodeBefore.type.name !== 'ValueName') return null;
  // Prevent module name from showing up after `.`
  if (nodeBefore.parent?.type.name === 'NamespacedValue') return null;
  const includedModules = includedBuiltinModules(context.state);

  const match = context.matchBefore(/\w+/);
  if (!match) return null;

  return {
    from: match.from,
    to: match.to,
    options: includedModules.map(mod => ({
      label: mod,
      info: builtinModules.find(builtin => builtin.name === mod)?.description,
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
  if (moduleNameMatch.from === moduleNameMatch.to && !context.explicit)
    return null;

  const includedModules = includedBuiltinModules(context.state);

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

const playgroundCompletions: CompletionSource[] = [
  atRuleCompletion,
  builtinModulesCompletion,
  builtinModuleNameCompletion,
  sassCompletionSource,
  builtinModuleItemCompletion,
];

export default playgroundCompletions;
