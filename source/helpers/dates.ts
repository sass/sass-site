import {
  format as formatBase,
  formatDistanceToNow as formatDistanceBase,
} from 'date-fns';

/**
 * Returns the formatted date string in the given format.
 *
 * @see https://date-fns.org/docs/format
 */
export const format = (date: string, pattern = 'd MMMM yyyy') =>
  formatBase(new Date(date), pattern);

/**
 * Returns the distance between the given date and now in words.
 *
 * @see https://date-fns.org/docs/formatDistanceToNow
 */
export const formatDistanceToNow = (date: string) =>
  formatDistanceBase(new Date(date));

/* eslint-disable @typescript-eslint/no-unsafe-member-access,
                  @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-explicit-any */
export default function datesPlugin(eleventyConfig: any) {
  // filters...
  eleventyConfig.addLiquidFilter('format', format);
  eleventyConfig.addLiquidFilter('formatDistanceToNow', formatDistanceToNow);
}
