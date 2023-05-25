import * as cheerio from 'cheerio';

type TOCItem = {
  [key: string]: string | TOCItem[];
};

/**
 * Returns `text` and `href` for a documentation table-of-contents section.
 */
export const getDocTocData = (data: TOCItem) => {
  const text = Object.keys(data).filter((key) => key !== ':children')[0];
  const href = data[text] as string;
  return { text, href };
};

/**
 * Generates table of contents data for a documentation page.
 */
export const getToc = (html: string): TOCItem[] => {
  const $ = cheerio.load(html);
  $('a.anchor').remove();
  const headings = $('h2, h3, h4, h5, h6').filter('[id]');
  if (!headings.length) {
    return [];
  }
  const toc: TOCItem[] = [];
  let stack: TOCItem[] = [];

  headings.each((index, element) => {
    const h = element as cheerio.TagElement;
    const level = parseInt(h.name[1], 10);
    const title = $(h).html() as string;
    const id = $(h).attr('id') as string;
    const tocItem: TOCItem = { [title]: `#${id}` };
    if (level === 2) {
      toc.push(tocItem);
      stack = [tocItem];
    } else {
      const parent = stack[level - 3];
      if (parent) {
        if (!parent[':children']) {
          parent[':children'] = [];
        }
        (parent[':children'] as TOCItem[]).push(tocItem);
        stack.length = level - 2;
        stack[level - 2] = tocItem;
      } else {
        throw new Error(`Invalid heading level without parent: h${level}`);
      }
    }
  });
  return toc;
};
