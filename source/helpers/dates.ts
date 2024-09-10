import {
  format as formatBase,
  formatDistanceToNow as formatDistanceBase,
} from 'date-fns';

/**
 * Returns the formatted date string in the given format.
 *
 * @see https://date-fns.org/docs/format
 */
export function format(date: string, pattern = 'd MMMM yyyy'): string {
  return formatBase(new Date(date), pattern);
}

/**
 * Returns the distance between the given date and now in words.
 *
 * @see https://date-fns.org/docs/formatDistanceToNow
 */
export function formatDistanceToNow(date: string): string {
  return formatDistanceBase(new Date(date));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function datesPlugin(eleventyConfig: any): void {
  // filters...
  eleventyConfig.addLiquidFilter('format', format);
  eleventyConfig.addLiquidFilter('formatDistanceToNow', formatDistanceToNow);
}
