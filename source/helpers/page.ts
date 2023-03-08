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
 * Indicates whether the given page is part of the JS API documentation.
 */
export const isTypedoc = (page: Page) =>
  page.url ? page.url.startsWith('/documentation/js-api/') : false;
