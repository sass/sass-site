import {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from '@codemirror/autocomplete';
import {sassCompletionSource} from '@codemirror/lang-sass';
import {syntaxTree} from '@codemirror/language';
import {EditorState} from '@codemirror/state';

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

type ModuleDefinition = CompletionInfo & {
  functions?: CompletionInfo[];
  variables?: CompletionInfo[];
};

const builtinModules: ModuleDefinition[] = [
  {
    name: 'color',
    description:
      'generates new colors based on existing ones, making it easy to build color themes',
  },
  {
    name: 'list',
    description: 'lets you access and modify values in lists',
    functions: [
      {name: 'length'},
      {name: 'nth'},
      {name: 'set-nth'},
      {name: 'join'},
      {name: 'append'},
      {name: 'zip'},
      {name: 'index'},
      {name: 'is-bracketed'},
      {name: 'separator'},
      {name: 'slash'},
    ],
  },
  {
    name: 'map',
    description:
      'makes it possible to look up the value associated with a key in a map, and much more',
    functions: [
      {name: 'get'},
      {name: 'set'},
      {name: 'merge'},
      {name: 'remove'},
      {name: 'keys'},
      {name: 'values'},
      {name: 'has-key'},
      {name: 'deep-merge'},
      {name: 'deep-remove'},
    ],
  },
  {
    name: 'math',
    description: 'provides functions that operate on numbers',
    variables: [
      {name: '$e', description: undefined},
      {name: '$pi'},
      {name: '$epsilon'},
      {name: '$max-safe-integer'},
      {name: '$min-safe-integer'},
      {name: '$max-number'},
      {name: '$min-number'},
    ],
    functions: [
      {name: 'ceil', description: undefined},
      {name: 'clamp'},
      {name: 'floor'},
      {name: 'max'},
      {name: 'min'},
      {name: 'round'},
      {name: 'abs'},
      {name: 'hypot'},
      {name: 'log'},
      {name: 'pow'},
      {name: 'sqrt'},
      {name: 'acos'},
      {name: 'asin'},
      {name: 'atan'},
      {name: 'atan2'},
      {name: 'cos'},
      {name: 'sin'},
      {name: 'tan'},
      {name: 'compatible'},
      {name: 'is-unitless'},
      {name: 'unit'},
      {name: 'div'},
      {name: 'percentage'},
      {name: 'random'},
    ],
  },
  {
    name: 'meta',
    description: 'exposes the details of Sass’s inner workings',
    functions: [
      {name: 'apply'},
      {name: 'load-css'},
      {name: 'accepts-content'},
      {name: 'calc-args'},
      {name: 'call'},
      {name: 'context-exists'},
      {name: 'feature-exists'},
      {name: 'function-exists'},
      {name: 'mixin-exists'},
      {name: 'variable-exists'},
      {name: 'get-function'},
      {name: 'get-mixin'},
      {name: 'global-variable-exists'},
      {name: 'keywords'},
      {name: 'module-functions'},
      {name: 'module-mixins'},
      {name: 'module-variables'},
      {name: 'type-of'},
    ],
  },
  {
    name: 'selector',
    description: 'provides access to Sass’s powerful selector engine',
    functions: [
      {name: 'isSuperselector'},
      {name: 'simpleSelectors'},
      {name: 'parse'},
      {name: 'nest'},
      {name: 'append'},
      {name: 'extend'},
      {name: 'replace'},
      {name: 'unify'},
    ],
  },
  {
    name: 'string',
    description: 'makes it easy to combine, search, or split apart strings',
    functions: [
      {name: 'unquote'},
      {name: 'quote'},
      {name: 'to-upper-case'},
      {name: 'to-lower-case'},
      {name: 'length'},
      {name: 'insert'},
      {name: 'index'},
      {name: 'slice'},
      {name: 'unique-id'},
      {name: 'split'},
    ],
  },
];

const moduleNames = builtinModules.map(mod => mod.name);
const moduleNameRegExp = new RegExp(`(${moduleNames.join('|')}).\\$?(\\w)*`);

const moduleCompletions = Object.freeze(
  builtinModules.map(mod => ({
    label: `sass:${mod.name}`,
    apply: `sass:${mod.name}`,
    info: mod.description,
    type: 'class',
  }))
);

function builtinModulesCompletion(
  context: CompletionContext
): CompletionResult | null {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (nodeBefore.type.name !== 'StringLiteral') return null;
  if (nodeBefore.parent?.type.name !== 'UseStatement') return null;

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

function includedBuiltinModules(state: EditorState) {
  const text = state.doc.toString();
  const modNames = builtinModules.map(mod => mod.name);
  return modNames.filter(name => text.includes(`sass:${name}`));
}

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
  sassCompletionSource,
  builtinModuleItemCompletion,
];

export default playgroundCompletions;
