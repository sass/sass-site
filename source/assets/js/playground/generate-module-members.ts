// Gets list of all functions and variables for the built-in modules
//
// Outputs `./module-members.ts` file, which is omitted from source code and
// must be built before the `playground` bundle is built with rollup.
import {compileString, sassTrue} from 'sass';
import {writeFileSync} from 'fs';
import path from 'path';

const modules = [
  'color',
  'list',
  'map',
  'math',
  'meta',
  'selector',
  'string',
] as const;

type ModuleName = (typeof modules)[number];

interface ModuleDefinition {
  name: ModuleName;
  functions?: string[];
  variables?: string[];
}

// Generate Scss with a custom function that extracts each module's functions
// and variables.
function generateModuleMembers(): ModuleDefinition[] {
  // Generate Sass
  const moduleSass = `
${modules.map(mod => `@use "sass:${mod}";`).join('\n')}
$modules: ${modules.join(',')};

selector{
  @each $module in $modules {
    f: extract(map.keys(meta.module-functions($module)), $module, functions);
    $variables: map.keys(meta.module-variables($module));
    @if (list.length($variables) > 0) {
      v: extract(map.keys(meta.module-variables($module)), $module, variables);
    }
  }
}
`;

  const modMap: ModuleDefinition[] = [];

  compileString(moduleSass, {
    functions: {
      'extract($keys, $name, $type)': function (args) {
        const [_keys, _mod, _type] = args;
        const keys = _keys.asList.toArray().map(key => key.assertString().text);
        const name = _mod.assertString('name').toString() as ModuleName;
        const type = _type.assertString('type').toString();

        if (type === 'functions') {
          modMap.push({name, functions: keys});
        } else {
          // functions extracted first in `moduleSass`, so they will already exist
          const existing = modMap.find(item => item.name === name);
          if (existing) {
            existing.variables = keys;
          } else {
            modMap.push({name, variables: keys});
          }
        }
        return sassTrue;
      },
    },
  });

  return modMap;
}

function writeFile() {
  const moduleMembers = generateModuleMembers();
  const filePath = path.resolve(__dirname, 'module-members.ts');
  try {
    writeFileSync(
      filePath,
      `export default ${JSON.stringify(moduleMembers, null, 2)} as const;`,
      'utf8'
    );
    console.log('module-members.ts built successfully');
  } catch (error) {
    console.error('module-members.ts not built');
    throw error;
  }
}

writeFile();
