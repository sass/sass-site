import sass from 'sass';

export function generateCodeExample(
  contents: string,
  autogenCSS: boolean,
  syntax: 'sass' | 'scss' | null,
) {
  const splitContents = contents.split('\n===\n');

  let scssContents, sassContents, cssContents;
  switch (syntax) {
    case 'scss':
      scssContents = splitContents[0];
      cssContents = splitContents[1];
      break;
    case 'sass':
      sassContents = splitContents[0];
      cssContents = splitContents[1];
      break;
    default:
      scssContents = splitContents[0];
      sassContents = splitContents[1];
      cssContents = splitContents[2];
      if (!sassContents) {
        throw new Error(`Couldn't find === in:\n${contents}`);
      }
      break;
  }

  const scssExamples =
    scssContents?.split('\n---\n').map((str) => str.trim()) ?? [];
  const sassExamples =
    sassContents?.split('\n---\n').map((str) => str.trim()) ?? [];

  if (!cssContents && autogenCSS) {
    const sections = scssContents ? scssExamples : sassExamples;
    if (sections.length !== 1) {
      throw new Error("Can't auto-generate CSS from more than one SCSS block.");
    }
    cssContents = sass.compileString(sections[0], {
      syntax: syntax === 'sass' ? 'indented' : 'scss',
    }).css;
  }

  const cssExamples =
    cssContents?.split('\n---\n').map((str) => str.trim()) ?? [];

  const { canSplit, maxSourceWidth, maxCSSWidth } = getCanSplit(
    scssExamples,
    sassExamples,
    cssExamples,
  );
  let splitLocation: number | null = null;
  if (canSplit) {
    if (maxSourceWidth < 55 && maxCSSWidth < 55) {
      splitLocation = 0.5 * 100;
    } else {
      // Put the split exactly in between the two longest lines.
      splitLocation = 0.5 + ((maxSourceWidth - maxCSSWidth) / 110.0 / 2) * 100;
    }
  }

  return {
    scss: scssExamples,
    sass: sassExamples,
    css: cssExamples,
    canSplit,
    splitLocation,
  };
}

export function getImplStatus(status: string | boolean | null) {
  switch (status) {
    case true:
      return '✓';
    case false:
      return '✗';
    case 'partial':
    case null:
      return status;
    default:
      return `since ${status}`;
  }
}

function getCanSplit(
  scssExamples: string[],
  sassExamples: string[],
  cssExamples: string[],
) {
  const exampleSourceLengths = [...scssExamples, ...sassExamples].flatMap(
    (source) => source.split('\n').map((line) => line.length),
  );
  const cssSourceLengths = cssExamples.flatMap((source) =>
    source.split('\n').map((line) => line.length),
  );

  const maxSourceWidth = Math.max(...exampleSourceLengths);
  const maxCSSWidth = Math.max(...cssSourceLengths);

  const canSplit = Boolean(maxCSSWidth && maxSourceWidth + maxCSSWidth < 110);

  return {
    canSplit,
    maxSourceWidth,
    maxCSSWidth,
  };
}
