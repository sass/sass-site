import {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from '@codemirror/autocomplete';
import {sassCompletionSource} from '@codemirror/lang-sass';
import {syntaxTree} from '@codemirror/language';

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

const builtinModules = [
  {
    name: 'color',
    description:
      'generates new colors based on existing ones, making it easy to build color themes',
  },
  {name: 'list', description: 'lets you access and modify values in lists'},
  {
    name: 'map',
    description:
      'makes it possible to look up the value associated with a key in a map, and much more',
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
  {name: 'meta', description: 'exposes the details of Sass’s inner workings'},
  {
    name: 'selector',
    description: 'provides access to Sass’s powerful selector engine',
  },
  {
    name: 'string',
    description: 'makes it easy to combine, search, or split apart strings',
  },
];

const moduleNames = builtinModules.map(module => module.name);
const moduleNameRegExp = new RegExp(`(${moduleNames.join('|')}).\\$?(\\w)*`);

const moduleCompletions = Object.freeze(
  builtinModules.map(module => ({
    label: `"sass:${module.name}"`,
    // don't add extra quote on the end, as it likely is already there
    apply: `"sass:${module.name}`,
    info: module.description,
    type: 'class',
  }))
);

function builtinModulesCompletion(
  context: CompletionContext
): CompletionResult | null {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (nodeBefore.parent?.type.name !== 'UseStatement') return null;

  const atRule = context.matchBefore(/"(sass:)?\w*/);

  if (!atRule) return null;
  if (atRule.from === atRule.to && !context.explicit) return null;
  return {
    from: atRule.from,
    to: atRule.to,
    options: moduleCompletions,
  };
}

const moduleVariableCompletions = Object.freeze(
  builtinModules
    .flatMap(module => {
      return module.variables?.map(variable => ({
        label: `${module.name}.${variable.name}`,
        info: variable?.description,
        type: 'variable',
      }));
    })
    .filter(x => x !== undefined)
);
const moduleFunctionsCompletions = Object.freeze(
  builtinModules
    .flatMap(module => {
      return module.functions?.map(variable => ({
        label: `${module.name}.${variable.name}`,
        info: variable?.description,
        type: 'method',
        boost: 10,
      }));
    })
    .filter(x => x !== undefined)
);

function builtinModuleItemCompletion(
  context: CompletionContext
): CompletionResult | null {
  // const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  // if (nodeBefore.parent?.type.name !== 'UseStatement') return null;

  const atRule = context.matchBefore(moduleNameRegExp);
  console.log(atRule);

  if (!atRule) return null;
  if (atRule.from === atRule.to && !context.explicit) return null;
  return {
    from: atRule.from,
    to: atRule.to,
    options: [...moduleVariableCompletions, ...moduleFunctionsCompletions],
  };
}

const playgroundCompletions: CompletionSource[] = [
  atRuleCompletion,
  builtinModulesCompletion,
  sassCompletionSource,
  builtinModuleItemCompletion,
];

export default playgroundCompletions;
