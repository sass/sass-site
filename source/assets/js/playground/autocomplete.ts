import {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from '@codemirror/autocomplete';
import {sassCompletionSource} from '@codemirror/lang-sass';
import {syntaxTree} from '@codemirror/language';
import {EditorState} from '@codemirror/state';
import type {ModuleDefinition} from './generate-module-members';

let moduleMembers: ModuleDefinition[] = [];
try {
  moduleMembers = require('./module-members');
} catch (error) {
  console.error('module-members.json is missing');
  throw error;
}

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

const atRuleOptions = Object.freeze(
  atRuleKeywords.map(keyword => ({
    label: `@${keyword} `,
    type: 'keyword',
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
  };
}

type CompletionInfo = {
  name: string;
  description?: string;
};

type CompletionModule = CompletionInfo & {
  functions?: CompletionInfo[];
  variables?: CompletionInfo[];
};

const moduleNames = moduleMembers.map(mod => mod.name);

const moduleDescriptions = {
  color:
    'generates new colors based on existing ones, making it easy to build color themes',
  list: 'lets you access and modify values in lists',
  map: 'makes it possible to look up the value associated with a key in a map, and much more',
  math: 'provides functions that operate on numbers',
  meta: 'exposes the details of Sass’s inner workings',
  selector: 'provides access to Sass’s powerful selector engine',
  string: 'makes it easy to combine, search, or split apart strings',
};

const builtinModules: CompletionModule[] = moduleMembers.map(modMember => {
  return {
    name: modMember.name,
    description: moduleDescriptions[modMember.name],
    functions: (modMember.functions ?? []).map(name => ({name})),
    variables: (modMember.variables ?? []).map(name => ({name})),
  };
});

const moduleNameRegExp = new RegExp(`(${moduleNames.join('|')}).\\$?\\w*`);

const moduleCompletions = Object.freeze(
  builtinModules.map(mod => ({
    label: `sass:${mod.name}`,
    apply: `sass:${mod.name}`,
    info: mod.description,
    type: 'class',
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
  if (!potentialParentTypes.includes(nodeBefore.parent?.type.name || ''))
    return null;

  const moduleMatch = context.matchBefore(/["'](sass:)?\w*/);

  if (!moduleMatch) return null;
  if (moduleMatch.from === moduleMatch.to && !context.explicit) return null;
  return {
    from: moduleMatch.from + 1,
    to: moduleMatch.to,
    options: moduleCompletions,
  };
}

const moduleVariableCompletions = Object.freeze(
  builtinModules.reduce(
    (acc: {[k: string]: CompletionResult['options'] | []}, mod) => {
      acc[mod.name] =
        mod.variables?.map(variable => ({
          label: `${mod.name}.${variable.name}`,
          info: variable?.description,
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
        mod.functions?.map(variable => ({
          label: `${mod.name}.${variable.name}`,
          apply: `${mod.name}.${variable.name}(`,
          info: variable?.description,
          type: 'method',
          boost: 10,
        })) || [];
      return acc;
    },
    {}
  )
);

// Returns the list of built in modules that are included in the text.
function includedBuiltinModules(state: EditorState) {
  const text = state.doc.toString();
  return moduleNames.filter(name => text.includes(`sass:${name}`));
}

// Completions for the namespaces of included built in modules.
function builtinModuleNameCompletion(
  context: CompletionContext
): CompletionResult | null {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (nodeBefore.type.name !== 'ValueName') return null;
  const includedModules = includedBuiltinModules(context.state);

  const match = context.matchBefore(/\w+/);
  if (!match) return null;

  return {
    from: match.from,
    to: match.to,
    options: includedModules.map(mod => ({
      label: mod,
      info: moduleDescriptions[mod],
      type: 'class',
      boost: 20,
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
  )
    return null;
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
