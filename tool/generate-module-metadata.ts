// Gets list of all functions and variables for the built-in modules
//
// Outputs `sass-site/source/assets/js/playground/module-metadata.ts` file, which is omitted from source code and
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
function generateModuleMetadata(): ModuleDefinition[] {
  // Generate Sass
  const moduleSass = `
    ${modules.map(mod => `@use "sass:${mod}";`).join('\n')}
    $modules: ${modules.join(',')};

    @each $module in $modules {
    $_: extract($module, (
          functions: map.keys(meta.module-functions($module)),
          variables: map.keys(meta.module-variables($module))
        ));
    }
  `;

  const modMap: ModuleDefinition[] = [];

  compileString(moduleSass, {
    functions: {
      'extract($name, $members)': function (args) {
        const [_name, _members] = args;
        // const keys = _keys.asList.toArray().map(key => key.assertString().text);
        const {functions, variables} = _members
          .assertMap('members')
          .contents.toObject();
        const name = _name.assertString('name').toString() as ModuleName;

        const functionStrings = functions.asList
          .toArray()
          .map(key => key.assertString().text);
        const variableStrings = variables.asList
          .toArray()
          .map(key => key.assertString().text);

        const moduleDefinition: ModuleDefinition = {
          name,
          functions: [],
          variables: [],
        };

        if (functionStrings.length > 0) {
          moduleDefinition.functions = functionStrings;
        }

        if (variableStrings.length > 0) {
          moduleDefinition.variables = variableStrings;
        }

        modMap.push(moduleDefinition);

        return sassTrue;
      },
    },
  });

  return modMap;
}

function writeFile(): void {
  const moduleMembers = generateModuleMetadata();
  const filePath = path.resolve(
    __dirname,
    '../source/assets/js/playground/module-metadata.ts'
  );
  try {
    writeFileSync(
      filePath,
      `export default ${JSON.stringify(moduleMembers, null, 2)} as const;`,
      'utf8'
    );
    console.log('module-metadata.ts built successfully');
  } catch (error) {
    console.error('module-metadata.ts not built');
    throw error;
  }
}

writeFile();
