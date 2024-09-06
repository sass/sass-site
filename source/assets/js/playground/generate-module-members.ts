// Gets list of all functions and variables for the built-in modules
//
// Outputs `./module-members.ts` file, which is omitted from source code and
// must be built before the `playground` bundle is built with rollup.
import {compileString} from 'sass';
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

export type ModuleDefinition = {
  name: (typeof modules)[number];
  functions?: string[];
  variables?: string[];
};

function generateModuleMembers() {
  // Generate Sass
  const moduleSass = `
${modules.map(mod => `@use "sass:${mod}";`).join('\n')}
$modules: ${modules.join(',')};
@mixin moduleContents {
  @each $module in $modules{
    --#{$module}-functions: #{map.keys(meta.module-functions($module))};
    $variables: map.keys(meta.module-variables($module));
    @if (list.length($variables) > 0){
      --#{$module}-variables: #{$variables};
    }
  }
}
selector{
  @include moduleContents;
}
`;

  const {css} = compileString(moduleSass);

  function parsePropertyValue(key: string) {
    const match = css.match(new RegExp(`${key}: (.*);`));
    const list = match?.[1] || '';
    return list.split(', ').filter(item => item !== '');
  }

  const modMap: ModuleDefinition[] = [];
  modules.forEach(mod => {
    modMap.push({
      name: mod,
      functions: parsePropertyValue(`--${mod}-functions`),
      variables: parsePropertyValue(`--${mod}-variables`),
    });
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
