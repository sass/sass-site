/** The 11ty page object. */
interface Page {
  url: string | false;
  fileSlug: string;
  filePathStem: string;
  date: Date;
  inputPath: string;
  outputPath: string | false;
  outputFileExtension: string;
}

/**
 * Removes leading id (e.g. `001-`) from blog filenames.
 */
export function getBlogSlug(page: Page): string {
  return page.fileSlug.replace(/^(\d*-)/, '');
}

/**
 * Indicates whether the given page is part of the JS API documentation.
 */
export function isTypedoc(page: Page): boolean {
  return page.url ? page.url.startsWith('/documentation/js-api/') : false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function pagesPlugin(eleventyConfig: any): void {
  // filters...
  eleventyConfig.addLiquidFilter('getBlogSlug', getBlogSlug);
  eleventyConfig.addLiquidFilter('isTypedoc', isTypedoc);
}
