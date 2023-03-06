import sass from 'sass';

export function generateCodeExample(contents: string, autogenCSS: boolean, syntax: string) {
  const splitContents = contents.split('===');

  const scssContents = splitContents[0];
  const sassContents = splitContents[1];
  const cssContents = splitContents[2];

  const scssExamples = scssContents.split('---');
  const sassExamples = sassContents.split('---');

  let cssExample: string;
  if (cssContents) {
    cssExample = cssContents;
  } else {
    // TODO check first if you even have scss or sass to generate css from
    // TODO what if no scss but sass?
    cssExample = '';
    scssExamples.forEach((scssSnippet) => {
      const generatedCSS = sass.compileString(scssSnippet);
      cssExample += generatedCSS.css;
    });
  }

  return {
    scss: scssExamples,
    css: cssExample,
    sass: sassExamples,
    canSplit: canSplit(scssExamples, sassExamples, cssExample),
    splitLocation: '50.0%', // TODO remove when css grid implementation done
  };
}

export function getImplStatus(status: string | boolean | null) {
  switch (status) {
    case null:
      return status;
    case true:
      return '✓';
    case false:
      return '✗';
    case 'partial':
      return 'partial';
    default:
      return `since ${status}`;
  }
}

export function canSplit(
  scssExamples: string[],
  sassExamples: string[],
  cssExample: string,
) {
  const exampleSources: [string[], string[]] = [scssExamples, sassExamples]; 
  const exampleSourceLengths = exampleSources
    .map((sourceList) =>
      sourceList.map((source) =>
        source.split('\n').map((line) => line.length),
      ),
    )
    .flat()
    .flat();
  const cssSourceLengths = cssExample.split('\n').map((line) => line.length);

  const maxSourceWidth = Math.max(...exampleSourceLengths);
  const maxCSSWidth = Math.max(...cssSourceLengths) 
  //TODO css example doesn't include comments so extend inheritance example can split is wrong

  return Boolean((maxSourceWidth + maxCSSWidth) < 110);
}
